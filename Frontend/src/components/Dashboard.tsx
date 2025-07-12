import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  MessageSquare, 
  ThumbsUp, 
  Star, 
  Trophy, 
  Calendar,
  TrendingUp,
  Edit,
  Bookmark,
  Settings,
  Bell,
  Shield,
  Award
} from 'lucide-react';
import axios from '@/lib/axios';

interface DashboardProps {
  onAskQuestion: () => void;
}

const Dashboard = ({ onAskQuestion }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
  const [recentAnswers, setRecentAnswers] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const userRes = await axios.get('/auth/me');
        setUserData(userRes.data);
        const questionsRes = await axios.get('/questions?user=me');
        setRecentQuestions(questionsRes.data.questions || []);
        const answersRes = await axios.get('/answers?user=me');
        setRecentAnswers(answersRes.data.answers || []);
        // Achievements: You may need a dedicated endpoint or compute from user data
        setAchievements([]); // Placeholder, update as needed
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData?.avatar} alt={userData?.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {userData?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-heading font-bold text-foreground">
                {userData?.name}
              </h1>
              <p className="text-muted-foreground">@{userData?.username}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Member since {userData?.joinDate}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-secondary" />
                  <span className="font-medium">{userData?.reputation?.toLocaleString()} reputation</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">
                    {userData?.badges?.gold}🥇 {userData?.badges?.silver}🥈 {userData?.badges?.bronze}🥉
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="stackit-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{userData?.stats?.questionsAsked}</p>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="stackit-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-2xl font-bold">{userData?.stats?.answersGiven}</p>
                      <p className="text-sm text-muted-foreground">Answers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="stackit-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-2xl font-bold">{userData?.stats?.votesReceived}</p>
                      <p className="text-sm text-muted-foreground">Votes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="stackit-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{userData?.stats?.bestAnswers}</p>
                      <p className="text-sm text-muted-foreground">Best Answers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="stackit-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={onAskQuestion} className="stackit-button-primary">
                    Ask a Question
                  </Button>
                  <Button variant="outline">
                    Browse Questions
                  </Button>
                  <Button variant="outline">
                    View Notifications
                  </Button>
                  <Button variant="outline">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="stackit-card">
                <CardHeader>
                  <CardTitle>Recent Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentQuestions.slice(0, 3).map((question) => (
                    <div key={question.id} className="space-y-2">
                      <h4 className="font-medium hover:text-primary cursor-pointer">
                        {question.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{question.votes} votes</span>
                        <span>{question.answers} answers</span>
                        <span>{question.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="stackit-tag">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="stackit-card">
                <CardHeader>
                  <CardTitle>Recent Answers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAnswers.map((answer) => (
                    <div key={answer.id} className="space-y-2">
                      <h4 className="font-medium hover:text-primary cursor-pointer">
                        {answer.questionTitle}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{answer.votes} votes</span>
                        {answer.accepted && (
                          <Badge className="stackit-badge">
                            ✓ Accepted
                          </Badge>
                        )}
                        <span>{answer.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-heading font-semibold">Your Questions</h2>
              <Button onClick={onAskQuestion} className="stackit-button-primary">
                Ask New Question
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentQuestions.map((question) => (
                <Card key={question.id} className="stackit-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium hover:text-primary cursor-pointer mb-2">
                          {question.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{question.votes} votes</span>
                          <span>{question.answers} answers</span>
                          <span>{question.views} views</span>
                          <span>{question.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="stackit-tag">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge 
                        variant={question.status === 'accepted' ? 'default' : 'secondary'}
                        className={question.status === 'accepted' ? 'stackit-badge' : ''}
                      >
                        {question.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold">Achievements</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`stackit-card ${achievement.earned ? 'border-secondary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl ${!achievement.earned ? 'grayscale opacity-50' : ''}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.earned ? (
                          <p className="text-xs text-secondary mt-1">
                            Earned on {achievement.earnedDate}
                          </p>
                        ) : achievement.progress ? (
                          <div className="mt-2">
                            <Progress value={achievement.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.progress}% complete
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs content can be added similarly */}
          <TabsContent value="answers">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Your Answers</h3>
              <p className="text-muted-foreground">This section will show all your answers.</p>
            </div>
          </TabsContent>

          <TabsContent value="bookmarks">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Bookmarked Questions</h3>
              <p className="text-muted-foreground">Questions you've bookmarked will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Activity Feed</h3>
              <p className="text-muted-foreground">Your recent activity will be shown here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
