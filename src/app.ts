import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  private readonly MONGO_URI: string;

  constructor() {
    this.app = express();
    this.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb';

    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeViewEngine();
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());

    // Add request logging middleware (optional)
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
    this.app.use('/', routes);
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
      w: 'majority'
    };

    mongoose
      .connect(this.MONGO_URI, mongooseOptions)
      .then(() => console.log('Successfully connected to MongoDB'))
      .catch((error: Error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      });

    mongoose.connection.on('error', (error: Error) => {
      console.error('MongoDB runtime error:', error);
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

export default App;