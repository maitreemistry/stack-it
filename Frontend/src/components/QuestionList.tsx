import { useState, useMemo, useEffect } from 'react';
import { Filter, SortAsc, TrendingUp, Clock, MessageSquare, Search, X, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import QuestionCard from './QuestionCard';
import React from 'react';
import axios from '@/lib/axios';

interface QuestionListProps {
  onAskQuestion: () => void;
  initialSearchQuery?: string;
}

export default function QuestionList({ onAskQuestion, initialSearchQuery = '' }: QuestionListProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchType, setSearchType] = useState<'questions' | 'users' | 'all'>('all');
  const [loading, setLoading] = useState(true);

  // Fetch questions and users from backend
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const questionsRes = await axios.get('/questions');
        setQuestions(questionsRes.data.questions || []);
        // Use admin route for users
        const usersRes = await axios.get('/auth/admin/users');
        setUsers(usersRes.data.users || []);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Update search query when initialSearchQuery changes
  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

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

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(lowerCaseQuery) ||
        q.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        q.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
        q.author.name.toLowerCase().includes(lowerCaseQuery) ||
        q.author.username.toLowerCase().includes(lowerCaseQuery)
      );
    }

    filtered = filtered.filter(q => {
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

    filtered = [...filtered].sort((a, b) => {
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

    return filtered;
  }, [questions, sortBy, filterBy, searchQuery]);

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.username.toLowerCase().includes(lowerCaseQuery) ||
        user.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // Sort users by reputation by default
    filtered = [...filtered].sort((a, b) => b.reputation - a.reputation);

    return filtered;
  }, [users, searchQuery]);

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
        <div className="flex flex-col gap-4 mb-8">
          {/* Search Bar */}
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
            <p className="text-sm text-muted-foreground">
              Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} and {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
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
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {searchQuery ? (
            // Search Results with Tabs
            <div>
              {/* Search Type Tabs */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={searchType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('all')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  All ({filteredQuestions.length + filteredUsers.length})
                </Button>
                <Button
                  variant={searchType === 'questions' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('questions')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Questions ({filteredQuestions.length})
                </Button>
                <Button
                  variant={searchType === 'users' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType('users')}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Users ({filteredUsers.length})
                </Button>
              </div>

              {/* Results */}
              {(searchType === 'all' || searchType === 'questions') && filteredQuestions.length > 0 && (
                <div className="space-y-4 mb-8">
                  {searchType === 'all' && (
                    <h3 className="text-lg font-semibold text-foreground mb-4">Questions</h3>
                  )}
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
              )}

              {(searchType === 'all' || searchType === 'users') && filteredUsers.length > 0 && (
                <div className="space-y-4">
                  {searchType === 'all' && (
                    <h3 className="text-lg font-semibold text-foreground mb-4">Users</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h4 className="font-semibold text-foreground">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Reputation</span>
                            <span className="font-semibold text-foreground">{user.reputation.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Questions</span>
                            <span className="font-semibold text-foreground">{user.questions}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Answers</span>
                            <span className="font-semibold text-foreground">{user.answers}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {user.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {user.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredQuestions.length === 0 && filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <p className="text-lg font-medium mb-2">No results found</p>
                    <p>Try adjusting your search terms</p>
                  </div>
                  <Button onClick={onAskQuestion} className="stackit-button-secondary">
                    Ask Question
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Regular Questions List (no search)
            filteredQuestions.map((question, index) => (
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
            ))
          )}
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