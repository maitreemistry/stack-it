import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ThumbsDown, CheckCircle, Clock, Tag, User, MessageSquare, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from './Navigation';
import AIPoweredTools from './AIPoweredTools';

interface Answer {
  id: string;
  text: string;
  author: {
    username: string;
    id: string;
    avatar?: string;
    reputation?: number;
  };
  likes: number;
  dislikes: number;
  isAccepted: boolean;
  createdAt: Date;
  likedBy: string[];
  dislikedBy: string[];
}

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    username: string;
    id: string;
    avatar?: string;
    reputation?: number;
  };
  answers: Answer[];
  likes: number;
  dislikes: number;
  createdAt: Date;
  likedBy: string[];
  dislikedBy: string[];
}

const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({ id: 'u1', username: 'currentuser' }); // Mock user
  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  const handleAskQuestion = () => {
    // Navigate to home page and open ask modal
    navigate('/');
  };

  useEffect(() => {
    // Mock data that matches the QuestionList structure
    const mockQuestions = [
      {
        id: '1',
        title: 'How to implement authentication with JWT in React?',
        description: `<p>I'm trying to implement JWT authentication in my React application but I'm having issues with token refresh and storage. What are the best practices?</p>

<p>Here's what I have so far:</p>

<pre><code>const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    setToken(data.token);
    localStorage.setItem('token', data.token);
  };
};</code></pre>

<p>The issue I'm facing is with token refresh and secure storage. How should I handle token expiration and refresh tokens?</p>`,
        tags: ['react', 'jwt', 'authentication', 'javascript'],
        author: {
          username: 'Sarah Chen',
          id: 'u1',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
          reputation: 2456
        },
        likes: 23,
        dislikes: 2,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        answers: [
          {
            id: 'a1',
            text: `<p>For JWT authentication in React, here are the best practices:</p>

<pre><code>const useAuth = () => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    
    // Store tokens securely
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    
    // Use httpOnly cookies for refresh tokens
    document.cookie = \`refreshToken=\${data.refreshToken}; httpOnly; secure; sameSite=strict\`;
  };

  const refreshAccessToken = async () => {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      credentials: 'include' // Include cookies
    });
    const data = await response.json();
    setToken(data.accessToken);
  };
};</code></pre>

<p>This approach ensures secure token storage and automatic refresh.</p>`,
            author: {
              username: 'AuthExpert',
              id: 'u2',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
              reputation: 3200
            },
            likes: 15,
            dislikes: 1,
            isAccepted: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
            likedBy: [],
            dislikedBy: []
          },
          {
            id: 'a2',
            text: `<p>Another important consideration is token expiration handling:</p>

<pre><code>// Add to your useAuth hook
useEffect(() => {
  if (token) {
    const decoded = jwt_decode(token);
    const timeUntilExpiry = decoded.exp * 1000 - Date.now();
    
    // Refresh token 5 minutes before expiry
    if (timeUntilExpiry < 300000) {
      refreshAccessToken();
    }
  }
}, [token]);</code></pre>

<p>This ensures seamless user experience without token expiration issues.</p>`,
            author: {
              username: 'ReactDev',
              id: 'u3',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
              reputation: 1800
            },
            likes: 8,
            dislikes: 0,
            isAccepted: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            likedBy: [],
            dislikedBy: []
          }
        ]
      },
      {
        id: '2',
        title: 'Python vs JavaScript for backend development in 2024',
        description: `<p>I'm starting a new project and can't decide between Python (Django/Flask) and JavaScript (Node.js) for the backend. What are the pros and cons?</p>

<p>My requirements include:</p>
<ul>
<li>RESTful API development</li>
<li>Database integration (PostgreSQL)</li>
<li>Real-time features (WebSockets)</li>
<li>Scalability for future growth</li>
</ul>

<p>Which technology stack would you recommend and why?</p>`,
        tags: ['python', 'javascript', 'backend', 'nodejs', 'django'],
        author: {
          username: 'Alex Rodriguez',
          id: 'u4',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          reputation: 1823
        },
        likes: 18,
        dislikes: 3,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
        answers: [
          {
            id: 'a3',
            text: `<p>For your requirements, I'd recommend <strong>Node.js</strong> for the following reasons:</p>

<h3>Pros of Node.js:</h3>
<ul>
<li><strong>JavaScript everywhere:</strong> Same language for frontend and backend</li>
<li><strong>Performance:</strong> Excellent for I/O heavy applications</li>
<li><strong>Real-time:</strong> Native WebSocket support with Socket.io</li>
<li><strong>Ecosystem:</strong> Massive npm ecosystem with excellent packages</li>
<li><strong>Scalability:</strong> Easy horizontal scaling with clustering</li>
</ul>

<pre><code>// Example Node.js setup
const express = require('express');
const { Pool } = require('pg');
const socketIo = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Real-time features
io.on('connection', (socket) => {
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});</code></pre>`,
            author: {
              username: 'BackendGuru',
              id: 'u5',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
              reputation: 2500
            },
            likes: 12,
            dislikes: 0,
            isAccepted: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
            likedBy: [],
            dislikedBy: []
          }
        ]
      },
      {
        id: '3',
        title: 'CSS Grid vs Flexbox: When to use which?',
        description: `<p>I'm confused about when to use CSS Grid versus Flexbox. Can someone explain the differences and provide some practical examples?</p>

<p>I understand both are powerful layout tools, but I'm not sure when to choose one over the other for different scenarios.</p>`,
        tags: ['css', 'grid', 'flexbox', 'layout', 'frontend'],
        author: {
          username: 'Emma Thompson',
          id: 'u6',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          reputation: 3201
        },
        likes: 31,
        dislikes: 1,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        answers: []
      },
      {
        id: '4',
        title: 'Docker container keeps crashing on production server',
        description: `<p>My Docker container works fine locally but keeps crashing when deployed to production. The logs show memory issues but I'm not sure how to debug this.</p>

<p>Here's my Dockerfile:</p>

<pre><code>FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]</code></pre>

<p>The container crashes after running for a few hours. How can I diagnose and fix this?</p>`,
        tags: ['docker', 'production', 'memory', 'debugging', 'deployment'],
        author: {
          username: 'Michael Kim',
          id: 'u7',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          reputation: 1567
        },
        likes: 12,
        dislikes: 4,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        answers: []
      },
      {
        id: '5',
        title: 'Best practices for API rate limiting implementation',
        description: `<p>I need to implement rate limiting for my REST API. What are the best strategies and tools available? Should I use Redis or in-memory storage?</p>

<p>My API handles user authentication, file uploads, and data processing. I want to implement different rate limits for different endpoints.</p>`,
        tags: ['api', 'rate-limiting', 'redis', 'performance', 'backend'],
        author: {
          username: 'Lisa Zhang',
          id: 'u8',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face',
          reputation: 2890
        },
        likes: 27,
        dislikes: 2,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        answers: []
      }
    ];

    const foundQuestion = mockQuestions.find(q => q.id === id);
    if (foundQuestion) {
      setQuestion(foundQuestion);
    } else {
      // Fallback to a default question if ID not found
      setQuestion(mockQuestions[0]);
    }
  }, [id]);

  const handleLikeQuestion = () => {
    if (!user) {
      toast.error('Please log in to like questions');
      return;
    }

    if (!question) return;

    const hasLiked = question.likedBy.includes(user.id);
    const hasDisliked = question.dislikedBy.includes(user.id);

    if (hasLiked) {
      // Unlike
      setQuestion({
        ...question,
        likes: question.likes - 1,
        likedBy: question.likedBy.filter(id => id !== user.id)
      });
      toast.success('Removed from your likes');
    } else {
      // Like
      setQuestion({
        ...question,
        likes: question.likes + 1,
        likedBy: [...question.likedBy, user.id],
        // Remove from dislikes if previously disliked
        dislikes: hasDisliked ? question.dislikes - 1 : question.dislikes,
        dislikedBy: hasDisliked ? question.dislikedBy.filter(id => id !== user.id) : question.dislikedBy
      });
      toast.success('Added to your likes!');
    }
  };

  const handleDislikeQuestion = () => {
    if (!user) {
      toast.error('Please log in to dislike questions');
      return;
    }

    if (!question) return;

    const hasLiked = question.likedBy.includes(user.id);
    const hasDisliked = question.dislikedBy.includes(user.id);

    if (hasDisliked) {
      // Remove dislike
      setQuestion({
        ...question,
        dislikes: question.dislikes - 1,
        dislikedBy: question.dislikedBy.filter(id => id !== user.id)
      });
      toast.success('Removed from your dislikes');
    } else {
      // Dislike
      setQuestion({
        ...question,
        dislikes: question.dislikes + 1,
        dislikedBy: [...question.dislikedBy, user.id],
        // Remove from likes if previously liked
        likes: hasLiked ? question.likes - 1 : question.likes,
        likedBy: hasLiked ? question.likedBy.filter(id => id !== user.id) : question.likedBy
      });
      toast.success('Added to your dislikes');
    }
  };

  const handleLikeAnswer = (answerId: string) => {
    if (!user) {
      toast.error('Please log in to like answers');
      return;
    }

    if (!question) return;

    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return;

    const hasLiked = answer.likedBy.includes(user.id);
    const hasDisliked = answer.dislikedBy.includes(user.id);

    setQuestion({
      ...question,
      answers: question.answers.map(a =>
        a.id === answerId
          ? {
              ...a,
              likes: hasLiked ? a.likes - 1 : a.likes + 1,
              likedBy: hasLiked 
                ? a.likedBy.filter(id => id !== user.id)
                : [...a.likedBy, user.id],
              dislikes: hasDisliked ? a.dislikes - 1 : a.dislikes,
              dislikedBy: hasDisliked 
                ? a.dislikedBy.filter(id => id !== user.id)
                : a.dislikedBy
            }
          : a
      )
    });

    toast.success(hasLiked ? 'Removed from your likes' : 'Added to your likes!');
  };

  const handleDislikeAnswer = (answerId: string) => {
    if (!user) {
      toast.error('Please log in to dislike answers');
      return;
    }

    if (!question) return;

    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) return;

    const hasLiked = answer.likedBy.includes(user.id);
    const hasDisliked = answer.dislikedBy.includes(user.id);

    setQuestion({
      ...question,
      answers: question.answers.map(a =>
        a.id === answerId
          ? {
              ...a,
              dislikes: hasDisliked ? a.dislikes - 1 : a.dislikes + 1,
              dislikedBy: hasDisliked 
                ? a.dislikedBy.filter(id => id !== user.id)
                : [...a.dislikedBy, user.id],
              likes: hasLiked ? a.likes - 1 : a.likes,
              likedBy: hasLiked 
                ? a.likedBy.filter(id => id !== user.id)
                : a.likedBy
            }
          : a
      )
    });

    toast.success(hasDisliked ? 'Removed from your dislikes' : 'Added to your dislikes');
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!user || !question || user.id !== question.author.id) {
      toast.error('Only the question author can accept answers');
      return;
    }

    setQuestion({
      ...question,
      answers: question.answers.map(a => ({
        ...a,
        isAccepted: a.id === answerId ? !a.isAccepted : false
      }))
    });

    toast.success('Answer accepted!');
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to answer questions');
      return;
    }

    if (!newAnswer.trim()) {
      toast.error('Please write an answer');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const answer: Answer = {
        id: Date.now().toString(),
        text: newAnswer,
        author: {
          username: user.username,
          id: user.id,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser',
          reputation: 850
        },
        likes: 0,
        dislikes: 0,
        isAccepted: false,
        createdAt: new Date(),
        likedBy: [],
        dislikedBy: []
      };

      setQuestion(prev => prev ? {
        ...prev,
        answers: [...prev.answers, answer]
      } : prev);

      setNewAnswer('');
      toast.success('Answer posted successfully!');
    } catch (error) {
      toast.error('Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAskQuestion={handleAskQuestion} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Questions</span>
          </Button>
        </div>

        {/* Question */}
        <div className="stackit-card p-8 mb-8 animate-fade-in">
        <div className="flex items-start gap-6">
          {/* Like/Dislike */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`stackit-vote-button ${
                question.likedBy.includes(user?.id || '')
                  ? 'text-red-500 bg-red-50'
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
              }`}
              onClick={handleLikeQuestion}
              disabled={!user}
            >
              <Heart className={`h-6 w-6 ${question.likedBy.includes(user?.id || '') ? 'fill-current' : ''}`} />
            </Button>
            
            <div className="text-lg font-heading font-bold text-foreground">
              {question.likes}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className={`stackit-vote-button ${
                question.dislikedBy.includes(user?.id || '')
                  ? 'text-gray-500 bg-gray-50'
                  : 'text-muted-foreground hover:text-gray-500 hover:bg-gray-50'
              }`}
              onClick={handleDislikeQuestion}
              disabled={!user}
            >
              <ThumbsDown className={`h-5 w-5 ${question.dislikedBy.includes(user?.id || '') ? 'fill-current' : ''}`} />
            </Button>
            
            <div className="text-sm font-medium text-muted-foreground">
              {question.dislikes}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-heading font-bold text-foreground">{question.title}</h1>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary/10"
                  onClick={() => setShowAIFeatures(!showAIFeatures)}
                >
                  AI Tools
                </Button>
              )}
            </div>

            <div 
              className="prose prose-gray max-w-none mb-6 prose-headings:font-heading prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:p-4"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />

            {/* AI-Powered Tools (toggle) */}
            {showAIFeatures && (
              <AIPoweredTools content={question.description} />
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <span key={tag} className="stackit-tag">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-3">
                <img
                  src={question.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${question.author.username}`}
                  alt={question.author.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium text-foreground">{question.author.username}</div>
                  <div className="text-xs">{question.author.reputation || 0} reputation</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(question.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features */}
        {showAIFeatures && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-heading font-semibold text-foreground mb-2">AI Features</h3>
              <p className="text-muted-foreground text-sm">AI-powered question analysis and improvement suggestions would appear here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Answers */}
      <div className="stackit-card p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center">
            <MessageSquare className="h-6 w-6 mr-3" />
            {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {/* Answers List */}
        <div className="space-y-8">
          {question.answers.map((answer) => (
            <div key={answer.id} className="border-b border-border pb-8 last:border-b-0">
              <div className="flex items-start gap-6">
                {/* Like/Dislike */}
                <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`stackit-vote-button ${
                      answer.likedBy.includes(user?.id || '')
                        ? 'text-red-500 bg-red-50'
                        : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                    }`}
                    onClick={() => handleLikeAnswer(answer.id)}
                    disabled={!user}
                  >
                    <Heart className={`h-5 w-5 ${answer.likedBy.includes(user?.id || '') ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <div className="text-lg font-heading font-bold text-foreground">{answer.likes}</div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`stackit-vote-button ${
                      answer.dislikedBy.includes(user?.id || '')
                        ? 'text-gray-500 bg-gray-50'
                        : 'text-muted-foreground hover:text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDislikeAnswer(answer.id)}
                    disabled={!user}
                  >
                    <ThumbsDown className={`h-5 w-5 ${answer.dislikedBy.includes(user?.id || '') ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <div className="text-sm font-medium text-muted-foreground">{answer.dislikes}</div>
                  
                  {/* Accept Answer */}
                  {user?.id === question.author.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`stackit-vote-button ${
                        answer.isAccepted
                          ? 'text-secondary bg-secondary/10'
                          : 'text-muted-foreground hover:text-secondary hover:bg-secondary/10'
                      }`}
                      onClick={() => handleAcceptAnswer(answer.id)}
                      title={answer.isAccepted ? 'Accepted Answer' : 'Accept Answer'}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {answer.isAccepted && (
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <Badge className="bg-secondary text-secondary-foreground">Accepted Answer</Badge>
                    </div>
                  )}

                  <div 
                    className="prose prose-gray max-w-none mb-6 prose-headings:font-heading prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:p-4"
                    dangerouslySetInnerHTML={{ __html: answer.text }}
                  />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <img
                        src={answer.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${answer.author.username}`}
                        alt={answer.author.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-foreground">{answer.author.username}</div>
                        <div className="text-xs">{answer.author.reputation || 0} reputation</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(answer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Answer Form */}
        {user ? (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-6">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here... Use markdown for formatting."
                className="stackit-input w-full min-h-[200px] resize-y"
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="stackit-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post Answer'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">
              You need to be logged in to answer questions
            </p>
            <Link to="/login">
              <Button className="stackit-button-primary">
                Log In to Answer
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default QuestionPage; 