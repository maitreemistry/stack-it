import { Document, Model } from 'mongoose';
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    profilePic: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    isModified(path?: string): boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
}
export interface IUserModel extends Model<IUser> {
}
declare const User: IUserModel;
export default User;
//# sourceMappingURL=User.d.ts.map