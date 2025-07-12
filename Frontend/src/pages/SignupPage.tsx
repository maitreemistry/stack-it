import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signup as apiSignup } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/lib/UserContext";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toast({
        title: "Error",
        description: "Full name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required.",
        variant: "destructive"
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match!",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await apiSignup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });
      
      if (result.success && result.user) {
        login({
          _id: result.user._id,
          name: result.user.fullName,
          email: result.user.email,
          profilePic: result.user.profilePic,
          role: result.user.role
        });
        toast({
          title: "Welcome to StackIt!",
          description: "Your account has been created successfully.",
        });
        navigate('/');
      } else {
        toast({
          title: "Error",
          description: result.message || 'Signup failed',
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Signup failed. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to StackIt
        </Button>
        {/* Main Auth Card */}
        <Card className="stackit-card backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4">
              <div className="font-heading font-bold text-3xl">
                <span className="text-primary">Stack</span>
                <span className="text-secondary">It</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign up to join StackIt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="stackit-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="stackit-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="signupPassword"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="stackit-input pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="stackit-input"
                  required
                />
              </div>
              <div className="text-xs text-muted-foreground">
                By continuing you indicate that you agree to StackIt's{' '}
                <Button variant="link" className="h-auto p-0 text-xs text-secondary">
                  Terms of Service
                </Button>{' '}
                and{' '}
                <Button variant="link" className="h-auto p-0 text-xs text-secondary">
                  Privacy Policy
                </Button>
                .
              </div>
              <Button
                type="submit"
                className="stackit-button-secondary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          © 2024 StackIt, Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 