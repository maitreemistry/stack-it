import { ArrowUp, ArrowDown, MessageSquare, Bookmark, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  votes: number;
  answers: number;
  views: number;
  timeAgo: string;
  isAnswered: boolean;
  hasAcceptedAnswer: boolean;
}

interface QuestionCardProps {
  question: Question;
  onVote: (questionId: string, direction: 'up' | 'down') => void;
  onBookmark: (questionId: string) => void;
}

export default function QuestionCard({ question, onVote, onBookmark }: QuestionCardProps) {
  return (
    <div className="stackit-card p-6 hover:scale-[1.02] animate-fade-in">
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-2 min-w-[60px]">
          <Button
            variant="ghost"
            size="sm"
            className="stackit-vote-button text-muted-foreground hover:text-secondary hover:bg-secondary/10"
            onClick={() => onVote(question.id, 'up')}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
          
          <div className="text-lg font-heading font-semibold text-foreground">
            {question.votes}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="stackit-vote-button text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onVote(question.id, 'down')}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
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
                onClick={() => onBookmark(question.id)}
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