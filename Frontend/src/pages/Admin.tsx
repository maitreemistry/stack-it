import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  MessageSquare,
  Flag,
  BarChart3,
  Settings,
  Bell,
  Shield,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  UserX,
  FileText,
  Tag,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');
  const { toast } = useToast();

  // Real data state
  const [users, setUsers] = useState<any[]>([]);
  const [flaggedContent, setFlaggedContent] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Users (admin route)
        const usersRes = await axios.get('/auth/admin/users');
        setUsers(usersRes.data.users || []);
        // Flagged content (assuming /questions/flagged and /answers/flagged)
        const flaggedQuestions = await axios.get('/questions/flagged');
        const flaggedAnswers = await axios.get('/answers/flagged');
        setFlaggedContent([
          ...(flaggedQuestions.data.questions || []),
          ...(flaggedAnswers.data.answers || [])
        ]);
        // Analytics (assuming /admin/analytics or build from users/questions)
        // For now, just count users/questions/answers
        const questionsRes = await axios.get('/questions');
        const answersRes = await axios.get('/answers');
        setAnalytics({
          totalUsers: usersRes.data.users?.length || 0,
          totalQuestions: questionsRes.data.questions?.length || 0,
          totalAnswers: answersRes.data.answers?.length || 0,
          totalReports: flaggedQuestions.data.questions?.length + flaggedAnswers.data.answers?.length || 0,
          // Add more analytics as needed
        });
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to fetch admin data', variant: 'destructive' });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleUserAction = (action: string, userId: number) => {
    toast({
      title: "Action Completed",
      description: `${action} action performed on user ${userId}`,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to perform bulk actions",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Bulk Action Completed",
      description: `${action} performed on ${selectedUsers.length} users`,
    });
    setSelectedUsers([]);
  };

  const handleSendAnnouncement = () => {
    if (!announcementTitle || !announcementMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and message",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Announcement Sent",
      description: "Platform-wide announcement has been sent successfully",
    });
    setAnnouncementTitle('');
    setAnnouncementMessage('');
  };

  const handleContentModeration = (contentId: number, action: string) => {
    toast({
      title: "Content Moderated",
      description: `Content ${contentId} has been ${action}`,
    });
  };

  const exportReport = (type: string) => {
    toast({
      title: "Report Exported",
      description: `${type} report has been downloaded successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary font-heading">Admin Panel</h1>
              <p className="text-muted-foreground mt-1">Manage StackIt platform and community</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="stackit-badge flex items-center"><Shield className="h-3 w-3 mr-1" />Admin Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card rounded-xl border border-border mb-6 overflow-x-auto admin-scrollbar">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 font-medium text-primary">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2 font-medium text-primary">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center space-x-2 font-medium text-primary">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Moderation</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center space-x-2 font-medium text-primary">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 font-medium text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 font-medium text-primary">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="stackit-card">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                      <span className="text-sm font-medium">Total Users</span>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </div>
                  </div>
                  <div className="stackit-card">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                      <span className="text-sm font-medium">Total Questions</span>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-2xl font-bold">{analytics.totalQuestions.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </div>
                  </div>
                  <div className="stackit-card">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                      <span className="text-sm font-medium">Total Answers</span>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-2xl font-bold">{analytics.totalAnswers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </div>
                  </div>
                  <div className="stackit-card">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                      <span className="text-sm font-medium">Active Reports</span>
                      <Flag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="text-2xl font-bold">{analytics.totalReports}</div>
                      <p className="text-xs text-muted-foreground">-5% from last week</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="stackit-card">
                    <div className="p-4">
                      <div className="font-heading font-semibold text-lg mb-1">Recent Activity</div>
                      <div className="text-muted-foreground mb-4 text-sm">Latest platform activities</div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New user registration</p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Question flagged for review</p>
                            <p className="text-xs text-muted-foreground">15 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">User account suspended</p>
                            <p className="text-xs text-muted-foreground">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stackit-card">
                    <div className="p-4">
                      <div className="font-heading font-semibold text-lg mb-1">Quick Actions</div>
                      <div className="text-muted-foreground mb-4 text-sm">Common administrative tasks</div>
                      <div className="space-y-3">
                        <button className="stackit-button-secondary w-full flex items-center justify-start"><Eye className="h-4 w-4 mr-2" />Review Flagged Content</button>
                        <button className="stackit-button-secondary w-full flex items-center justify-start"><Bell className="h-4 w-4 mr-2" />Send Announcement</button>
                        <button className="stackit-button-secondary w-full flex items-center justify-start"><Users className="h-4 w-4 mr-2" />Manage Users</button>
                        <button className="stackit-button-secondary w-full flex items-center justify-start"><Download className="h-4 w-4 mr-2" />Export Reports</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No users found.</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="stackit-input pl-10 w-64"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="stackit-input w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="stackit-button-secondary px-4 py-2 text-sm flex items-center"
                      onClick={() => handleBulkAction('ban')}
                      disabled={selectedUsers.length === 0}
                    >
                      <Ban className="h-4 w-4 mr-2" />Ban Selected
                    </button>
                    <button
                      className="stackit-button-secondary px-4 py-2 text-sm flex items-center"
                      onClick={() => handleBulkAction('suspend')}
                      disabled={selectedUsers.length === 0}
                    >
                      <UserX className="h-4 w-4 mr-2" />Suspend Selected
                    </button>
                  </div>
                </div>
                <div className="stackit-card">
                  <div className="p-4">
                    <div className="font-heading font-semibold text-lg mb-1">User Management</div>
                    <div className="text-muted-foreground mb-4 text-sm">Manage all registered users and their permissions</div>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                          <div className="flex items-center space-x-4">
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                }
                              }}
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-primary">{user.name}</h3>
                                <span className={`stackit-badge ${user.status === 'active' ? '' : user.status === 'banned' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'}`}>{user.status}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-muted-foreground">Rep: {user.reputation}</span>
                                <span className="text-xs text-muted-foreground">Q: {user.questions}</span>
                                <span className="text-xs text-muted-foreground">A: {user.answers}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="stackit-vote-button" onClick={() => handleUserAction('view', user.id)}><Eye className="h-4 w-4" /></button>
                            <button className="stackit-vote-button" onClick={() => handleUserAction('edit', user.id)}><Edit className="h-4 w-4" /></button>
                            {user.status === 'active' ? (
                              <button className="stackit-vote-button" onClick={() => handleUserAction('ban', user.id)}><Ban className="h-4 w-4" /></button>
                            ) : (
                              <button className="stackit-vote-button" onClick={() => handleUserAction('unban', user.id)}><UserCheck className="h-4 w-4" /></button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : flaggedContent.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No flagged content found.</div>
            ) : (
              <>
                <div className="stackit-card">
                  <div className="p-4">
                    <div className="font-heading font-semibold text-lg mb-1">Content Moderation</div>
                    <div className="text-muted-foreground mb-4 text-sm">Review and moderate flagged content</div>
                    <div className="space-y-4">
                      {flaggedContent.map((content) => (
                        <div key={content.id} className="border border-border rounded-lg p-4 bg-background">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="stackit-badge bg-muted text-muted-foreground">{content.type}</span>
                                <span className={`stackit-badge ${content.status === 'pending' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>{content.status}</span>
                              </div>
                              <h3 className="font-medium text-primary mb-1">{content.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">by {content.author}</p>
                              <p className="text-sm text-muted-foreground">Reason: {content.reason}</p>
                              <p className="text-xs text-muted-foreground mt-1">Reported on {content.reportedAt}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="stackit-button-secondary px-3 py-1 text-sm flex items-center" onClick={() => handleContentModeration(content.id, 'approved')}><CheckCircle className="h-4 w-4 mr-1" />Approve</button>
                              <button className="stackit-button-secondary px-3 py-1 text-sm flex items-center" onClick={() => handleContentModeration(content.id, 'edited')}><Edit className="h-4 w-4 mr-1" />Edit</button>
                              <button className="stackit-button-secondary px-3 py-1 text-sm flex items-center" onClick={() => handleContentModeration(content.id, 'deleted')}><Trash2 className="h-4 w-4 mr-1" />Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="stackit-card">
                <div className="p-4">
                  <div className="font-heading font-semibold text-lg mb-1">Send Announcement</div>
                  <div className="text-muted-foreground mb-4 text-sm">Send platform-wide notifications to all users</div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <input
                        className="stackit-input mt-1"
                        placeholder="Announcement title..."
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        className="stackit-input mt-1"
                        placeholder="Announcement message..."
                        value={announcementMessage}
                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={announcementType} onValueChange={setAnnouncementType}>
                        <SelectTrigger className="stackit-input mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Information</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <button onClick={handleSendAnnouncement} className="stackit-button-primary w-full flex items-center justify-center"><Bell className="h-4 w-4 mr-2" />Send Announcement</button>
                  </div>
                </div>
              </div>
              <div className="stackit-card">
                <div className="p-4">
                  <div className="font-heading font-semibold text-lg mb-1">Recent Announcements</div>
                  <div className="text-muted-foreground mb-4 text-sm">Previously sent announcements</div>
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-3 bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-primary">System Maintenance</h4>
                        <span className="stackit-badge bg-muted text-muted-foreground">Maintenance</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Scheduled maintenance on January 25th, 2024 from 2-4 AM EST.
                      </p>
                      <p className="text-xs text-muted-foreground">Sent 2 days ago</p>
                    </div>
                    <div className="border border-border rounded-lg p-3 bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-primary">New Features Available</h4>
                        <span className="stackit-badge bg-muted text-muted-foreground">Update</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Check out our new AI-powered answer suggestions and improved search!
                      </p>
                      <p className="text-xs text-muted-foreground">Sent 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="stackit-card">
                    <div className="p-4">
                      <div className="font-heading font-semibold text-lg mb-1">Top Contributors</div>
                      <div className="text-muted-foreground mb-4 text-sm">Users with highest contributions this month</div>
                      <div className="space-y-3">
                        {/* mockAnalytics.topContributors.map((contributor, index) => ( */}
                        {/* This section needs to be updated to use actual data */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">1</span>
                            </div>
                            <div>
                              <p className="font-medium text-primary">John Doe</p>
                              <p className="text-sm text-muted-foreground">60 contributions</p>
                            </div>
                          </div>
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">2</span>
                            </div>
                            <div>
                              <p className="font-medium text-primary">Jane Smith</p>
                              <p className="text-sm text-muted-foreground">45 contributions</p>
                            </div>
                          </div>
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">3</span>
                            </div>
                            <div>
                              <p className="font-medium text-primary">Bob Wilson</p>
                              <p className="text-sm text-muted-foreground">30 contributions</p>
                            </div>
                          </div>
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="stackit-card">
                    <div className="p-4">
                      <div className="font-heading font-semibold text-lg mb-1">Most Flagged Users</div>
                      <div className="text-muted-foreground mb-4 text-sm">Users with highest number of content flags</div>
                      <div className="space-y-3">
                        {/* mockAnalytics.mostFlaggedUsers.map((user, index) => ( */}
                        {/* This section needs to be updated to use actual data */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-destructive">1</span>
                            </div>
                            <div>
                              <p className="font-medium text-destructive">Charlie Davis</p>
                              <p className="text-sm text-muted-foreground">8 flags</p>
                            </div>
                          </div>
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-destructive">2</span>
                            </div>
                            <div>
                              <p className="font-medium text-destructive">Eve Johnson</p>
                              <p className="text-sm text-muted-foreground">5 flags</p>
                            </div>
                          </div>
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-destructive">3</span>
                            </div>
                            <div>
                              <p className="font-medium text-destructive">Alice Brown</p>
                              <p className="text-sm text-muted-foreground">3 flags</p>
                            </div>
                          </div>
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="stackit-card">
                  <div className="p-4">
                    <div className="font-heading font-semibold text-lg mb-1">Export Reports</div>
                    <div className="text-muted-foreground mb-4 text-sm">Download detailed analytics and user reports</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        className="stackit-button-secondary flex items-center space-x-2 w-full"
                        onClick={() => exportReport('User Activity')}
                      >
                        <Download className="h-4 w-4" />
                        <span>User Activity Report</span>
                      </button>
                      <button
                        className="stackit-button-secondary flex items-center space-x-2 w-full"
                        onClick={() => exportReport('Content Moderation')}
                      >
                        <Download className="h-4 w-4" />
                        <span>Moderation Report</span>
                      </button>
                      <button
                        className="stackit-button-secondary flex items-center space-x-2 w-full"
                        onClick={() => exportReport('Platform Analytics')}
                      >
                        <Download className="h-4 w-4" />
                        <span>Analytics Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="stackit-card">
                <div className="p-4">
                  <div className="font-heading font-semibold text-lg mb-1">Platform Settings</div>
                  <div className="text-muted-foreground mb-4 text-sm">Configure platform-wide settings and limits</div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Post Rate Limit (per hour)</label>
                      <input type="number" className="stackit-input mt-1" placeholder="5" defaultValue="5" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Minimum Reputation for Voting</label>
                      <input type="number" className="stackit-input mt-1" placeholder="15" defaultValue="15" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Auto-moderation Threshold</label>
                      <Select defaultValue="3">
                        <SelectTrigger className="stackit-input mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 flag</SelectItem>
                          <SelectItem value="2">2 flags</SelectItem>
                          <SelectItem value="3">3 flags</SelectItem>
                          <SelectItem value="5">5 flags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <button className="stackit-button-primary w-full">Save Settings</button>
                  </div>
                </div>
              </div>
              <div className="stackit-card">
                <div className="p-4">
                  <div className="font-heading font-semibold text-lg mb-1">Tag Management</div>
                  <div className="text-muted-foreground mb-4 text-sm">Manage question tags and categories</div>
                  <div className="flex space-x-2 mb-4">
                    <input className="stackit-input" placeholder="Add new tag..." />
                    <button className="stackit-button-secondary px-4">Add</button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-border rounded bg-background">
                      <span>javascript</span>
                      <button className="stackit-vote-button"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-border rounded bg-background">
                      <span>python</span>
                      <button className="stackit-vote-button"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-border rounded bg-background">
                      <span>react</span>
                      <button className="stackit-vote-button"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 