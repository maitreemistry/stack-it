import mongoose from 'mongoose';
import Question from '../models/Question';
import User from '../models/User';
import 'dotenv/config';

const sampleQuestions = [
  {
    title: "How do I deploy a React app to Netlify?",
    body: "I have a React app and want to deploy it to Netlify. What steps do I need to follow? Are there any gotchas?",
    tags: ["react", "deployment", "netlify"],
    votes: 7
  },
  {
    title: "Difference between let, const, and var in JavaScript?",
    body: "Can someone explain the difference between let, const, and var in JavaScript with examples?",
    tags: ["javascript", "es6", "variables"],
    votes: 15
  },
  {
    title: "How to use useEffect in React?",
    body: "I'm confused about how and when to use useEffect in React. Can someone provide a simple explanation and example?",
    tags: ["react", "hooks", "useeffect"],
    votes: 10
  },
  {
    title: "Best way to connect MongoDB with Node.js?",
    body: "What is the best way to connect a Node.js backend to MongoDB? Should I use Mongoose or the native driver?",
    tags: ["nodejs", "mongodb", "mongoose"],
    votes: 12
  },
  {
    title: "How to style components in React?",
    body: "What are the different ways to style components in React? Which one is recommended for large projects?",
    tags: ["react", "css", "styled-components", "emotion"],
    votes: 8
  },
  {
    title: "What is async/await in JavaScript?",
    body: "How does async/await work in JavaScript? Can you show a simple example?",
    tags: ["javascript", "async-await", "promises"],
    votes: 9
  },
  {
    title: "How to handle authentication in Express.js?",
    body: "What are the best practices for handling authentication in an Express.js app? Should I use JWT, sessions, or something else?",
    tags: ["express", "authentication", "jwt", "sessions"],
    votes: 11
  },
  {
    title: "How to use TypeScript with React?",
    body: "I'm new to TypeScript and want to use it with React. What are the first steps and common pitfalls?",
    tags: ["typescript", "react", "typescript-react"],
    votes: 13
  },
  {
    title: "How to optimize React app performance?",
    body: "My React app is getting slow. What are some tips and tools to optimize its performance?",
    tags: ["react", "performance", "optimization"],
    votes: 6
  },
  {
    title: "How to use environment variables in Node.js?",
    body: "How do I use environment variables in a Node.js app? Is dotenv the best way?",
    tags: ["nodejs", "environment-variables", "dotenv"],
    votes: 5
  }
];

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

const addSampleQuestions = async () => {
  try {
    await connectDB();

    // Create or find a test user
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

    // Add each sample question if it doesn't already exist
    for (const q of sampleQuestions) {
      const exists = await Question.findOne({ title: q.title });
      if (!exists) {
        await Question.create({ ...q, author: user._id });
        console.log('✅ Added question:', q.title);
      } else {
        console.log('ℹ️  Question already exists:', q.title);
      }
    }

    console.log('🎉 Sample questions added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample questions:', error);
    process.exit(1);
  }
};

addSampleQuestions(); 