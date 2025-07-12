import mongoose from 'mongoose';

// Database connection function
export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            console.error('MONGODB_URI is not defined in environment variables');
            process.exit(1);
        }

        console.log('Connecting to MongoDB Atlas...');
        
        await mongoose.connect(mongoURI);
        
        console.log('✅ MongoDB Atlas connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}; 