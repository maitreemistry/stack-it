import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login({ email: formData.email, password: formData.password });
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to StackIt.",
        });
        setIsLoading(false);
        navigate('/');
      } else {
        toast({
          title: "Error",
          description: result.message || 'Login failed',
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Login failed',
        variant: "destructive"
      });
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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Login to your StackIt account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="stackit-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
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
              <div className="flex items-center justify-between">
                <Button variant="link" className="px-0 text-sm text-muted-foreground">
                  Forgot password?
                </Button>
              </div>
              <Button
                type="submit"
                className="stackit-button-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>
            
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

export default LoginPage; 