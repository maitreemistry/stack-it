import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createAdmin(): Promise<void> {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@stackit.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists, updating role...');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Admin role updated successfully!');
      return;
    }

    // Create new admin user
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@stackit.com',
      password: 'admin123456', // This will be hashed automatically
      profilePic: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Admin&backgroundColor=fcd34d',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@stackit.com');
    console.log('🔑 Password: admin123456');
    console.log('👑 Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin(); 