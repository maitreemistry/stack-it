import 'dotenv/config';

console.log('🔍 Environment Variables Debug:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY ? '✅ Set' : '❌ Missing');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');

if (process.env.MONGODB_URI) {
    console.log('📡 Connection string preview:', process.env.MONGODB_URI.substring(0, 50) + '...');
} 