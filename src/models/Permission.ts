import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Interface for Designation Document
export interface IPermission extends Document {
  name: string;
  company: mongoose.Types.ObjectId;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

// Schema Definition
const PermissionSchema: Schema<IPermission> = new Schema(
  {
    name: {
      type: String,
      required: true,
    //   unique: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    }, 

    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, 
  }
);
PermissionSchema.index({ name: 1, company: 1 }, { unique: true });
// Model Definition
const Permission: Model<IPermission> = mongoose.model<IPermission>(
  "Permission",
  PermissionSchema
);

export default Permission;
