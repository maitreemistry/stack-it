import mongoose, { Document } from 'mongoose';
export interface IAnswer extends Document {
    body: string;
    author: mongoose.Types.ObjectId;
    question: mongoose.Types.ObjectId;
    votes: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAnswer, {}, {}, {}, mongoose.Document<unknown, {}, IAnswer, {}> & IAnswer & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Answer.d.ts.map