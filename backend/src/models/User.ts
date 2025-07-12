import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
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

// Interface for User model
export interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { 
    timestamps: true  // createdAt, updatedAt
});

// Pre hook for password hashing
userSchema.pre('save', async function (this: IUser, next: Function) {
    if (!this.isModified('password')) return next(); // if password is not modified, skip hashing

    try {
        const salt = await bcrypt.genSalt(10); // 10 is the number of rounds
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to match password
userSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string): Promise<boolean> {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
};

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
