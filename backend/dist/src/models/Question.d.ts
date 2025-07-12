import mongoose, { Document } from 'mongoose';
export interface IQuestion extends Document {
    title: string;
    body: string;
    tags: string[];
    author: mongoose.Types.ObjectId;
    votes: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IQuestion, {}, {}, {}, mongoose.Document<unknown, {}, IQuestion, {}> & IQuestion & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Question.d.ts.map