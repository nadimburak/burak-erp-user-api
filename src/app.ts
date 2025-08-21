import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import mongoose, { ConnectOptions, Model } from 'mongoose';
import path from 'path';
import { Server, Socket } from 'socket.io';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import routes from './routes';
import { verifyToken } from './utils/jwt';
import User from './models/User';
import TestModel from './models/Test';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  public server: ReturnType<typeof createServer>;
  public io: Server;
  private readonly MONGO_URI: string;
  private isDBConnected: boolean;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });
    this.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb';
    this.isDBConnected = false;

    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeViewEngine();
    this.initializeRoutes();
    this.initializeSocketIO();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());

    // Add request logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  private initializeViewEngine(): void {
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private initializeRoutes(): void {
    // MongoDB test endpoint
    this.app.get('/mongo-test', (req: Request, res: Response, next: NextFunction): void => {
      if (!this.isDBConnected) {
        res.status(503).json({ error: 'Database not connected' });
        return;
      }

      // Use an async IIFE to handle async/await with error forwarding
      (async () => {
        try {
          // Create a test document
          const testDoc = new TestModel();
          await testDoc.save();

          // Retrieve all test documents
          const docs = await TestModel.find().sort({ createdAt: -1 }).limit(10);

          res.json({
            status: 'success',
            message: 'MongoDB connection test successful',
            latestDocument: testDoc,
            recentDocuments: docs
          });
        } catch (error) {
          console.error('MongoDB test error:', error);
          res.status(500).json({ error: 'MongoDB operation failed' });
        }
      })().catch(next);
    });

    // Main routes
    this.app.use('/', routes);
  }

  private initializeSocketIO(): void {
    // Socket.io middleware for authentication
    this.io.use(async (socket: Socket, next) => {
      const token = socket.handshake.auth.token ||
        socket.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const verified = await verifyToken(token as string);

        // Check if the token is valid
        if (!verified) {
          return next(new Error('Authentication error: Invalid token'));
        }

        let user = null;
        if (typeof verified !== "string" && "userId" in verified) {
          const userId = verified.userId;
          user = await User.findById(userId);
        }

        socket.data.user = user;
        next();
      } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user;
      console.log(`User ${user?.id} connected with socket ID: ${socket.id}`);

      // Join user to their personal room
      if (user?.id) {
        socket.join(`user_${user.id}`);
        socket.join('authenticated_users');
      }
      
      // Disconnection handler
      socket.on('disconnect', () => {
        console.log(`User ${user?.id} disconnected`);
        if (user?.id) {
          socket.leave(`user_${user.id}`);
        }
      });
    });

    // Make io accessible in routes
    this.app.set('io', this.io);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeDatabase(): void {
    if (!this.MONGO_URI) {
      console.error('MongoDB connection URI not found in environment variables');
      process.exit(1);
    }

    const mongooseOptions: ConnectOptions = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000 // 30 seconds
    };

    mongoose
      .connect(this.MONGO_URI, mongooseOptions)
      .then(() => {
        console.log('Successfully connected to MongoDB');
        this.isDBConnected = true;
      })
      .catch((error: Error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      });

    mongoose.connection.on('error', (error: Error) => {
      console.error('MongoDB runtime error:', error);
      this.isDBConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      this.isDBConnected = false;
    });
  }

  public start(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`WebSocket server ready at ws://localhost:${port}`);
    });
  }

  public getDBStatus(): boolean {
    return this.isDBConnected;
  }
}

export default App;