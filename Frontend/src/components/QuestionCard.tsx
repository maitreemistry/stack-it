import { Heart, ThumbsDown, MessageSquare, Bookmark, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  tags: string[];
  likes: number;
  dislikes: number;
  answers: number;
  views: number;
  timeAgo: string;
  isAnswered: boolean;
  hasAcceptedAnswer: boolean;
}

interface QuestionCardProps {
  question: Question;
  onLike: (questionId: string) => void;
  onDislike: (questionId: string) => void;
  onBookmark: (questionId: string) => void;
}

export default function QuestionCard({ question, onLike, onDislike, onBookmark }: QuestionCardProps) {
  const navigate = useNavigate();

  const handleQuestionClick = () => {
    navigate(`/question/${question.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(question.id);
  };

  const handleDislikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDislike(question.id);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark(question.id);
  };

  return (
    <div className="stackit-card p-6 hover:scale-[1.02] animate-fade-in cursor-pointer" onClick={handleQuestionClick}>
      <div className="flex gap-4">
        {/* Like/Dislike Section */}
        <div className="flex flex-col items-center space-y-2 min-w-[60px]">
          <Button
            variant="ghost"
            size="sm"
            className="stackit-vote-button text-muted-foreground hover:text-red-500 hover:bg-red-50"
            onClick={handleLikeClick}
          >
            <Heart className="h-5 w-5" />
          </Button>
          
          <div className="text-lg font-heading font-semibold text-foreground">
            {question.likes}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="stackit-vote-button text-muted-foreground hover:text-gray-500 hover:bg-gray-50"
            onClick={handleDislikeClick}
          >
            <ThumbsDown className="h-5 w-5" />
          </Button>
          
          <div className="text-sm font-medium text-muted-foreground">
            {question.dislikes}
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col items-center space-y-3 min-w-[80px] text-center">
          <div className="flex flex-col items-center">
            <div className={`text-lg font-semibold ${question.hasAcceptedAnswer ? 'text-secondary' : 'text-muted-foreground'}`}>
              {question.answers}
            </div>
            <div className="text-xs text-muted-foreground">answers</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-muted-foreground">
              {question.views}
            </div>
            <div className="text-xs text-muted-foreground">views</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-xl font-heading font-semibold text-foreground mb-3 hover:text-primary cursor-pointer transition-colors line-clamp-2">
            {question.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {question.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <span key={tag} className="stackit-tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Author */}
              <div className="flex items-center space-x-2">
                <img
                  src={question.author.avatar}
                  alt={question.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {question.author.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {question.author.reputation} rep
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{question.timeAgo}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {question.hasAcceptedAnswer && (
                <span className="stackit-badge bg-secondary">Solved</span>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-secondary"
                onClick={handleBookmarkClick}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}