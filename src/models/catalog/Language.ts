import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILanguage extends Document {
  name: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
}

const LanguageSchema: Schema<ILanguage> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Language: Model<ILanguage> = mongoose.model<ILanguage>(
  "Language",
  LanguageSchema
);

export default Language;
