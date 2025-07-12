import express, { Express, Request, Response, NextFunction } from 'express';
import 'dotenv/config';      // to load environment variables from .env file automatically when the app starts
import authRoutes from './routes/auth.route';  // import auth routes
import questionsRoutes from './routes/questions.route';
import answersRoutes from './routes/answers.route';
import usersRoutes from './routes/users.route';

import cors from 'cors';  // to enable CORS for the API
import cookieParser from 'cookie-parser';  // to parse cookies in request
import { connectDB } from './lib/db';

const app: Express = express();
const PORT: string | undefined = process.env.PORT;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true //allow frontend to send cookies
}));

app.use(express.json());  // to parse JSON request body
app.use(cookieParser());  // to parse cookies in request

// API Routes
app.use('/api/auth', authRoutes);        // import auth routes
app.use('/api/questions', questionsRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/users', usersRoutes);


console.log("Routes initialized successfully");

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});

export default app;
