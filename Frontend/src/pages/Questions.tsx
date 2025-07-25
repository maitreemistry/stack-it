import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, SortAsc, SortDesc, Search, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import QuestionList from '@/components/QuestionList';
import AskQuestionModal from '@/components/AskQuestionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import axios from '@/lib/axios';
import { createQuestion } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/lib/UserContext';

const Questions = () => {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await axios.get('/questions');
        setQuestions(res.data.questions || []);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  const handleAskQuestion = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to ask a question.",
        variant: "destructive"
      });
      return;
    }
    setIsAskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAskModalOpen(false);
  };

  const handleSubmitQuestion = async (questionData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to ask a question.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createQuestion({
        title: questionData.title,
        body: questionData.content,
        tags: questionData.tags
      });

      if (result.success) {
        toast({
          title: "Question posted!",
          description: "Your question has been successfully posted.",
        });
        handleCloseModal();
        // Refresh the questions list
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to post question",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error creating question:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to post question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filters = [
    { id: 'all', label: 'All Questions' },
    { id: 'unanswered', label: 'Unanswered' },
    { id: 'answered', label: 'Answered' },
    { id: 'recent', label: 'Recent' },
    { id: 'popular', label: 'Popular' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest', icon: SortDesc },
    { id: 'oldest', label: 'Oldest', icon: SortAsc },
    { id: 'votes', label: 'Most Voted', icon: SortDesc },
    { id: 'answers', label: 'Most Answers', icon: SortDesc },
    { id: 'views', label: 'Most Viewed', icon: SortDesc },
  ];

  // Filter and search questions
  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(question => 
        question.title.toLowerCase().includes(query) ||
        question.excerpt?.toLowerCase().includes(query) ||
        (question.tags || []).some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'unanswered':
        filtered = filtered.filter(q => q.answers === 0);
        break;
      case 'answered':
        filtered = filtered.filter(q => q.answers > 0);
        break;
      case 'recent':
        filtered = filtered.filter(q => {
          const daysAgo = (Date.now() - new Date(q.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysAgo <= 7;
        });
        break;
      case 'popular':
        filtered = filtered.filter(q => q.likes >= 10);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'votes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'answers':
        filtered.sort((a, b) => b.answers - a.answers);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        // 'newest' - default sorting
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [questions, searchQuery, selectedFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAskQuestion={handleAskQuestion} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                All Questions
              </h1>
              <p className="text-muted-foreground">
                Browse and search through all programming questions
              </p>
            </div>
            <Button 
              onClick={handleAskQuestion}
              className="stackit-button-secondary"
            >
              Ask Question
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                <Input
                  placeholder="Search questions by title, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-12 text-base border-2 focus:border-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Filter by:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <Badge
                      key={filter.id}
                      variant={selectedFilter === filter.id ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 select-none ${
                        selectedFilter === filter.id 
                          ? 'bg-primary text-primary-foreground shadow-md border-primary' 
                          : 'bg-background text-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary'
                      }`}
                      onClick={() => setSelectedFilter(filter.id)}
                    >
                      {filter.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="lg:w-80">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-foreground">Sort by:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.id}
                        variant={sortBy === option.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy(option.id)}
                        className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 select-none ${
                          sortBy === option.id 
                            ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 border-primary' 
                            : 'bg-background text-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p>Loading questions...</p>
            </div>
          ) : filteredQuestions.length > 0 ? (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {question.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{question.likes} likes</span>
                      <span>{question.answers} answers</span>
                      <span>{question.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchQuery ? (
                  <>
                    <p className="text-lg font-medium mb-2">No questions found</p>
                    <p>Try adjusting your search terms or filters</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">No questions available</p>
                    <p>Be the first to ask a question!</p>
                  </>
                )}
              </div>
              <Button onClick={handleAskQuestion} className="stackit-button-secondary">
                Ask Question
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredQuestions.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredQuestions.length} of {questions.length} questions
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitQuestion}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Questions; 