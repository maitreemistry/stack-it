import { useState } from 'react';
import { Search, TrendingUp, Users, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  onAskQuestion: () => void;
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onAskQuestion, onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 stackit-gradient-hero opacity-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 text-foreground">
            Ask. Answer.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Grow.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our community of knowledge seekers and experts. 
            Get answers to your questions and help others learn.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6 pointer-events-none transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search thousands of questions or ask your own..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-14 pr-40 py-5 text-xl font-medium h-16 rounded-2xl border border-border bg-white/90 shadow-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground placeholder:text-muted-foreground hover:border-primary outline-none"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-32 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 rounded-full bg-muted/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground shadow transition-all z-10"
                  tabIndex={-1}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              <Button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:from-primary/90 hover:to-secondary/90 focus:ring-2 focus:ring-primary/30 transition-all z-20"
                style={{ letterSpacing: '0.03em' }}
              >
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={onAskQuestion}
              className="stackit-button-primary text-lg px-8 py-4 h-auto"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Ask a Question
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-4 h-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Browse Questions
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-heading font-bold text-foreground mb-2">10K+</div>
              <div className="text-muted-foreground">Questions Asked</div>
            </div>

            <div className="text-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-heading font-bold text-foreground mb-2">5K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>

            <div className="text-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-heading font-bold text-foreground mb-2">95%</div>
              <div className="text-muted-foreground">Questions Answered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-xl"></div>
    </section>
  );
}