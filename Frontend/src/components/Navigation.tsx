import { useState } from 'react';
import { Search, Bell, User, Plus, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/lib/UserContext';

interface NavigationProps {
  onAskQuestion: () => void;
}

export default function Navigation({ onAskQuestion }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // Helper for avatar initial
  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || '?';

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="font-heading font-bold text-2xl text-primary">
              Stack<span className="text-secondary">It</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <button onClick={() => navigate('/questions')} className="text-foreground hover:text-primary transition-colors">Questions</button>
              <button onClick={() => navigate('/')} className="text-foreground hover:text-primary transition-colors">Users</button>
              <button onClick={() => navigate('/admin')} className="text-foreground hover:text-primary transition-colors">Admin</button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions, tags, users..."
                className="pl-10 stackit-input"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Ask Question Button */}
            <Button 
              onClick={onAskQuestion}
              className="stackit-button-secondary hidden md:flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ask Question</span>
            </Button>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="relative">
                  <button
                    className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-secondary"
                    onClick={() => setProfileDropdown((v) => !v)}
                  >
                    {getInitial(user.name)}
                  </button>
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-secondary/10 transition-colors"
                        onClick={() => { setProfileDropdown(false); navigate('/dashboard'); }}
                      >
                        My Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-secondary/10 transition-colors flex items-center"
                        onClick={() => { setProfileDropdown(false); logout(); }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                    Log In
                  </Button>
                  <Button className="stackit-button-primary" size="sm" onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-slide-up">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 stackit-input"
                />
              </div>
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <button onClick={() => navigate('/questions')} className="block py-2 text-foreground hover:text-primary transition-colors">Questions</button>
                <button onClick={() => navigate('/')} className="block py-2 text-foreground hover:text-primary transition-colors">Users</button>
                <button onClick={() => navigate('/admin')} className="block py-2 text-foreground hover:text-primary transition-colors">Admin</button>
              </div>
              {/* Mobile Ask Question Button */}
              <Button 
                onClick={onAskQuestion}
                className="stackit-button-secondary w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
              {/* Mobile Auth/Profile Buttons */}
              {user ? (
                <div className="space-y-2 pt-4 border-t border-border">
                  <button
                    className="w-full flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold justify-center mb-1"
                    onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }}
                  >
                    {getInitial(user.name)} <span className="ml-2">My Profile</span>
                  </button>
                  <button
                    className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-secondary/10 transition-colors justify-center"
                    onClick={() => { setIsMenuOpen(false); logout(); }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-border">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                    Log In
                  </Button>
                  <Button className="stackit-button-primary w-full" onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}