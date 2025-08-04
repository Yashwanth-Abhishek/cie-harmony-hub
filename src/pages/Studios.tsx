import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Calendar from "@/components/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Camera, Edit, Share, Upload, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface ContentPlan {
  id: string;
  title: string;
  type: "video" | "photo" | "article" | "social";
  status: "planning" | "shooting" | "editing" | "published";
  teamMember: string;
  shootDate?: string;
  editDate?: string;
  publishDate?: string;
}

const teamMembers = ["Sarah Johnson", "Mike Chen", "Lisa Park"];

const contentPlans: ContentPlan[] = [
  {
    id: "1",
    title: "Innovation Workshop Highlights",
    type: "video",
    status: "editing",
    teamMember: "Sarah Johnson",
    shootDate: "2024-02-20",
    editDate: "2024-02-22",
    publishDate: "2024-02-25"
  },
  {
    id: "2",
    title: "Student Success Stories",
    type: "article",
    status: "published",
    teamMember: "Mike Chen",
    publishDate: "2024-02-18"
  },
  {
    id: "3",
    title: "CIE Campus Tour",
    type: "photo",
    status: "planning",
    teamMember: "Lisa Park",
    shootDate: "2024-03-01"
  }
];

// Calendar events for content planning (including holidays and events, shoot/edit/post dates)
const contentEvents = [
  { id: "1", title: "Workshop Video Shoot", date: "2024-02-20", type: "event" as const, category: "shoot" },
  { id: "2", title: "Photo Session Edit", date: "2024-03-02", type: "event" as const, category: "edit" },
  { id: "3", title: "Content Publish", date: "2024-02-25", type: "event" as const, category: "post" },
  { id: "4", title: "Independence Day", date: "2024-08-15", type: "holiday" as const },
  { id: "5", title: "Campus Tour Shoot", date: "2024-03-01", type: "event" as const, category: "shoot" }
];

export default function Studios() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewType, setViewType] = useState<"calendar" | "dashboard" | "timeline">("calendar");
  const [studioContent, setStudioContent] = useState<Tables<'studio_content'>[]>([]);
  const [newContent, setNewContent] = useState({
    title: "",
    type: "",
    description: "",
    teamMember: "",
    shootDate: "",
    editDate: "",
    postDate: "",
    documentFile: null as File | null
  });

  useEffect(() => {
    fetchStudioContent();
  }, []);

  const fetchStudioContent = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudioContent(data || []);
    } catch (error) {
      console.error('Error fetching studio content:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-pastel-yellow/50 text-yellow-700";
      case "shooting": return "bg-pastel-blue/50 text-blue-700";
      case "editing": return "bg-pastel-peach/50 text-orange-700";
      case "published": return "bg-pastel-green/50 text-green-700";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Camera className="h-4 w-4" />;
      case "photo": return <Camera className="h-4 w-4" />;
      case "article": return <Edit className="h-4 w-4" />;
      case "social": return <Share className="h-4 w-4" />;
      default: return <Edit className="h-4 w-4" />;
    }
  };

  const handleCreateContent = async () => {
    if (newContent.title && newContent.type && newContent.teamMember) {
      try {
        const { error } = await supabase
          .from('studio_content')
          .insert({
            title: newContent.title,
            content_type: newContent.type,
            team_members: [newContent.teamMember],
            shoot_date: newContent.shootDate || null,
            edit_date: newContent.editDate || null,
            post_date: newContent.postDate || null,
            status: 'planning'
          });

        if (error) throw error;
        
        // Refresh content
        await fetchStudioContent();
        setNewContent({
          title: "",
          type: "",
          description: "",
          teamMember: "",
          shootDate: "",
          editDate: "",
          postDate: "",
          documentFile: null
        });
        setShowCreateForm(false);
      } catch (error) {
        console.error('Error creating content:', error);
      }
    }
  };

  // Convert database content to calendar events
  const allContentEvents = [
    ...contentEvents, // Keep static holiday events
    ...studioContent.flatMap(content => {
      const events = [];
      if (content.shoot_date) {
        events.push({
          id: `shoot-${content.id}`,
          title: `${content.title} - Shoot`,
          date: content.shoot_date,
          type: "event" as const,
          category: "shoot"
        });
      }
      if (content.edit_date) {
        events.push({
          id: `edit-${content.id}`,
          title: `${content.title} - Edit`,
          date: content.edit_date,
          type: "event" as const,
          category: "edit"
        });
      }
      if (content.post_date) {
        events.push({
          id: `publish-${content.id}`,
          title: `${content.title} - Publish`,
          date: content.post_date,
          type: "event" as const,
          category: "post"
        });
      }
      return events;
    })
  ];

  return (
    <Layout currentPage="studios">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CIE Studios</h1>
            <p className="text-muted-foreground mt-1">Content planning and production management</p>
          </div>
          <div className="flex gap-2">
            <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="timeline">Timeline</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="btn-pastel"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Content Plan
            </Button>
          </div>
        </div>

        {/* Calendar View */}
        {viewType === "calendar" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Calendar events={allContentEvents} />
            </div>
            <div>
              <Card className="card-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Production Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pastel-blue rounded-full"></div>
                      <span className="text-sm">Shoot</span>
                    </div>
                    <span className="text-sm text-muted-foreground">3 this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pastel-peach rounded-full"></div>
                      <span className="text-sm">Edit</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2 this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pastel-green rounded-full"></div>
                      <span className="text-sm">Publish</span>
                    </div>
                    <span className="text-sm text-muted-foreground">4 this month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {viewType === "dashboard" && (
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Studio Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studioContent.map(content => (
                  <div key={content.id} className="border border-border/40 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(content.content_type)}
                        <h3 className="font-semibold text-foreground">{content.title}</h3>
                        <Badge variant="outline" className="bg-muted/50">
                          {content.content_type}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(content.status)}>
                        {content.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Team Member:</span>
                        <p className="font-medium">{content.team_members?.[0] || 'Unassigned'}</p>
                      </div>
                      {content.shoot_date && (
                        <div>
                          <span className="text-muted-foreground">Shoot Date:</span>
                          <p className="font-medium">{new Date(content.shoot_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {content.edit_date && (
                        <div>
                          <span className="text-muted-foreground">Edit Date:</span>
                          <p className="font-medium">{new Date(content.edit_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {content.post_date && (
                        <div>
                          <span className="text-muted-foreground">Publish Date:</span>
                          <p className="font-medium">{new Date(content.post_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline View */}
        {viewType === "timeline" && (
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Monthly Content Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3, 4].map(week => (
                  <div key={week} className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" className="bg-primary/10">
                        Week {week}
                      </Badge>
                      <div className="h-px bg-border flex-1"></div>
                    </div>
                    <div className="grid md:grid-cols-7 gap-2 ml-6">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                        <div key={day} className="p-2 border border-border/30 rounded text-center text-sm">
                          <div className="text-muted-foreground mb-1">{day}</div>
                          {Math.random() > 0.7 && (
                            <div className="w-2 h-2 bg-pastel-blue rounded-full mx-auto"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Content Form */}
        {showCreateForm && (
          <Card className="card-pastel">
            <CardHeader>
              <CardTitle>Add New Content Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Content Title</label>
                <Input 
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Content Type</label>
                  <Select value={newContent.type} onValueChange={(value) => setNewContent(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Team Member</label>
                  <Select value={newContent.teamMember} onValueChange={(value) => setNewContent(prev => ({ ...prev, teamMember: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={newContent.description}
                  onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Content description and requirements"
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Shoot Date</label>
                  <Input
                    type="date"
                    value={newContent.shootDate}
                    onChange={(e) => setNewContent(prev => ({ ...prev, shootDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Edit Date</label>
                  <Input
                    type="date"
                    value={newContent.editDate}
                    onChange={(e) => setNewContent(prev => ({ ...prev, editDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Post Date</label>
                  <Input
                    type="date"
                    value={newContent.postDate}
                    onChange={(e) => setNewContent(prev => ({ ...prev, postDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Project Document</label>
                <div className="mt-1 border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-border transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload project brief, script, or storyboard
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, or TXT files only
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1 btn-pastel" onClick={handleCreateContent}>
                  Create Content Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}