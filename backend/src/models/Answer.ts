import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
  body: string;
  author: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  votes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IAnswer>('Answer', answerSchema);
