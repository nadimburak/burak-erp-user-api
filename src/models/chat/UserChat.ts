import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for Designation Document
export interface IUserChat extends Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    text: string;
    read: boolean;
    created_at: Date;
    updated_at: Date;
}

// Schema Definition
const UserChatSchema: Schema<IUserChat> = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            required: false,
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

// Model Definition
const UserChat: Model<IUserChat> = mongoose.model<IUserChat>(
    "UserChat",
    UserChatSchema
);

export default UserChat;
