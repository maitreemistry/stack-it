import { useState } from 'react';
import { Filter, SortAsc, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuestionCard from './QuestionCard';

// Mock data for demonstration
const mockQuestions = [
  {
    id: '1',
    title: 'How to implement authentication with JWT in React?',
    excerpt: 'I\'m trying to implement JWT authentication in my React application but I\'m having issues with token refresh and storage. What are the best practices?',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
      reputation: 2456
    },
    tags: ['react', 'jwt', 'authentication', 'javascript'],
    likes: 23,
    dislikes: 2,
    answers: 4,
    views: 156,
    timeAgo: '2 hours ago',
    isAnswered: true,
    hasAcceptedAnswer: true
  },
  {
    id: '2',
    title: 'Python vs JavaScript for backend development in 2024',
    excerpt: 'I\'m starting a new project and can\'t decide between Python (Django/Flask) and JavaScript (Node.js) for the backend. What are the pros and cons?',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      reputation: 1823
    },
    tags: ['python', 'javascript', 'backend', 'nodejs', 'django'],
    likes: 18,
    dislikes: 3,
    answers: 7,
    views: 234,
    timeAgo: '4 hours ago',
    isAnswered: true,
    hasAcceptedAnswer: false
  },
  {
    id: '3',
    title: 'CSS Grid vs Flexbox: When to use which?',
    excerpt: 'I\'m confused about when to use CSS Grid versus Flexbox. Can someone explain the differences and provide some practical examples?',
    author: {
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      reputation: 3201
    },
    tags: ['css', 'grid', 'flexbox', 'layout', 'frontend'],
    likes: 31,
    dislikes: 1,
    answers: 9,
    views: 342,
    timeAgo: '6 hours ago',
    isAnswered: true,
    hasAcceptedAnswer: true
  },
  {
    id: '4',
    title: 'Docker container keeps crashing on production server',
    excerpt: 'My Docker container works fine locally but keeps crashing when deployed to production. The logs show memory issues but I\'m not sure how to debug this.',
    author: {
      name: 'Michael Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      reputation: 1567
    },
    tags: ['docker', 'production', 'memory', 'debugging', 'deployment'],
    likes: 12,
    dislikes: 4,
    answers: 2,
    views: 89,
    timeAgo: '1 day ago',
    isAnswered: false,
    hasAcceptedAnswer: false
  },
  {
    id: '5',
    title: 'Best practices for API rate limiting implementation',
    excerpt: 'I need to implement rate limiting for my REST API. What are the best strategies and tools available? Should I use Redis or in-memory storage?',
    author: {
      name: 'Lisa Zhang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face',
      reputation: 2890
    },
    tags: ['api', 'rate-limiting', 'redis', 'performance', 'backend'],
    likes: 27,
    dislikes: 2,
    answers: 5,
    views: 178,
    timeAgo: '1 day ago',
    isAnswered: true,
    hasAcceptedAnswer: true
  }
];

interface QuestionListProps {
  onAskQuestion: () => void;
}

export default function QuestionList({ onAskQuestion }: QuestionListProps) {
  const [questions, setQuestions] = useState(mockQuestions);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const handleLike = (questionId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, likes: q.likes + 1 }
          : q
      )
    );
  };

  const handleDislike = (questionId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, dislikes: q.dislikes + 1 }
          : q
      )
    );
  };

  const handleBookmark = (questionId: string) => {
    console.log('Bookmarked question:', questionId);
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime();
      case 'votes':
        return b.likes - a.likes;
      case 'answers':
        return b.answers - a.answers;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const filteredQuestions = sortedQuestions.filter(q => {
    switch (filterBy) {
      case 'unanswered':
        return !q.isAnswered;
      case 'answered':
        return q.isAnswered;
      case 'accepted':
        return q.hasAcceptedAnswer;
      default:
        return true;
    }
  });

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              Latest Questions
            </h2>
            <p className="text-muted-foreground">
              Discover questions from our community of developers
            </p>
          </div>
          
          <Button 
            onClick={onAskQuestion}
            className="stackit-button-primary mt-4 md:mt-0"
          >
            Ask Question
          </Button>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Questions</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="accepted">Accepted Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Newest
                  </div>
                </SelectItem>
                <SelectItem value="votes">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Most Votes
                  </div>
                </SelectItem>
                <SelectItem value="answers">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Most Answers
                  </div>
                </SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1"></div>

          <div className="text-sm text-muted-foreground">
            {filteredQuestions.length} questions found
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => (
            <div
              key={question.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <QuestionCard
                question={question}
                onLike={handleLike}
                onDislike={handleDislike}
                onBookmark={handleBookmark}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="px-8 py-3">
            Load More Questions
          </Button>
        </div>
      </div>
    </section>
  );
}