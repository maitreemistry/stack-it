// src/models/Question.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  body: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IQuestion>('Question', questionSchema);
