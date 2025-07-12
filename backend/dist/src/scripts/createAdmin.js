"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const User_1 = __importDefault(require("../models/User"));
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
async function createAdmin() {
    try {
        const existingAdmin = await User_1.default.findOne({ email: 'admin@stackit.com' });
        if (existingAdmin) {
            console.log('Admin already exists, updating role...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('✅ Admin role updated successfully!');
            return;
        }
        const adminUser = new User_1.default({
            fullName: 'Admin User',
            email: 'admin@stackit.com',
            password: 'admin123456',
            profilePic: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Admin&backgroundColor=fcd34d',
            role: 'admin'
        });
        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@stackit.com');
        console.log('🔑 Password: admin123456');
        console.log('👑 Role: admin');
    }
    catch (error) {
        console.error('❌ Error creating admin:', error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
}
createAdmin();
//# sourceMappingURL=createAdmin.js.map