import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ThumbsDown, CheckCircle, Clock, Tag, User, MessageSquare, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from './Navigation';
import AIPoweredTools from './AIPoweredTools';
import axios from '@/lib/axios';

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
  const [user, setUser] = useState<any>(null); // Replace with real user context if needed
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  const handleAskQuestion = () => {
    // Navigate to home page and open ask modal
    navigate('/');
  };

  useEffect(() => {
    async function fetchQuestion() {
      setLoading(true);
      try {
        const res = await axios.get(`/questions/${id}`);
        setQuestion(res.data.question);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    if (id) fetchQuestion();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              className="prose prose-gray max-w-none mb-6 prose-headings:font-heading prose-a:text-blue-600 prose-a:underline prose-a:hover:text-blue-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre_code:bg-transparent prose-pre_code:text-gray-100 prose-pre_code:p-0 prose-pre_code:font-mono prose-code:text-sm prose-pre_code:leading-relaxed"
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
                    className="prose prose-gray max-w-none mb-6 prose-headings:font-heading prose-a:text-blue-600 prose-a:underline prose-a:hover:text-blue-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre_code:bg-transparent prose-pre_code:text-gray-100 prose-pre_code:p-0 prose-pre_code:font-mono prose-code:text-sm prose-pre_code:leading-relaxed"
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