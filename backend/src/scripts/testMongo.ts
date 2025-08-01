import mongoose from 'mongoose';
import 'dotenv/config';

async function testMongoConnection(): Promise<void> {
    try {
        console.log('🔍 Testing MongoDB connection...');
        
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in environment variables');
            console.log('💡 Make sure your .env file exists and contains MONGODB_URI');
            return;
        }

        console.log('📡 Attempting to connect...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ MongoDB connected successfully!');
        console.log('📊 Database name:', mongoose.connection.db?.databaseName || 'Unknown');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('bad auth')) {
                console.log('\n💡 Authentication failed. Possible solutions:');
                console.log('1. Check username/password in connection string');
                console.log('2. URL encode special characters in password (@ = %40, # = %23)');
                console.log('3. Verify database user exists in Atlas');
                console.log('4. Check Network Access settings in Atlas');
            } else if (error.message.includes('ENOTFOUND')) {
                console.log('\n💡 Network error. Possible solutions:');
                console.log('1. Check your internet connection');
                console.log('2. Verify the cluster name in connection string');
                console.log('3. Check Network Access in Atlas');
            }
        }
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
    }
}

testMongoConnection(); 