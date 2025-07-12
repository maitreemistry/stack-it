const fs = require('fs');
const path = require('path');

const envContent = `PORT=5555
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/stackit
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Please update the MONGODB_URI if you\'re using MongoDB Atlas instead of local MongoDB');
} else {
    console.log('⚠️  .env file already exists');
}

console.log('\n🔧 Environment variables set:');
console.log('- PORT: 5555 (matches frontend configuration)');
console.log('- JWT_SECRET_KEY: your-super-secret-jwt-key-change-this-in-production');
console.log('- MONGODB_URI: mongodb://localhost:27017/stackit');
console.log('- NODE_ENV: development'); 