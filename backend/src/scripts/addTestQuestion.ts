import mongoose from 'mongoose';
import Question from '../models/Question';
import User from '../models/User';
import 'dotenv/config';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI is not defined');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

const addTestQuestion = async () => {
  try {
    await connectDB();

    // First, create a test user if none exists
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
        profilePic: 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=TestUser&backgroundColor=fcd34d'
      });
      console.log('✅ Created test user');
    }

    // Check if test question already exists
    const existingQuestion = await Question.findOne({ title: 'How to implement authentication in React?' });
    if (existingQuestion) {
      console.log('✅ Test question already exists');
      process.exit(0);
    }

    // Create test question
    const testQuestion = await Question.create({
      title: 'How to implement authentication in React?',
      body: 'I\'m building a React application and need to implement user authentication using JWT tokens. What\'s the best approach for storing tokens securely and handling authentication state? I\'ve tried using localStorage but I\'m concerned about security. Should I use HTTP-only cookies instead?',
      tags: ['react', 'javascript', 'authentication', 'jwt'],
      author: user._id,
      votes: 5
    });

    console.log('✅ Created test question:', testQuestion.title);
    console.log('🎉 Test data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test question:', error);
    process.exit(1);
  }
};

addTestQuestion(); 