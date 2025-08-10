import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Video, Edit, Share2, Upload, Calendar, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ContentPlan {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'blog' | 'social';
  status: 'planning' | 'shoot' | 'edit' | 'post' | 'completed';
  shootDate: string;
  editDate: string;
  postDate: string;
  teamMember: string;
  projectDocument?: string;
}

const contentTypes = ['video', 'podcast', 'blog', 'social'];
const statusTypes = ['planning', 'shoot', 'edit', 'post', 'completed'];
const teamMembers = ['Alice Johnson', 'Bob Smith', 'Carol Davis'];

export default function CIEStudios() {
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([
    {
      id: '1',
      title: 'Innovation in Tech Startups',
      type: 'video',
      status: 'edit',
      shootDate: '2024-08-20',
      editDate: '2024-08-25',
      postDate: '2024-09-01',
      teamMember: 'Alice Johnson',
      projectDocument: 'tech-startups-brief.pdf'
    },
    {
      id: '2',
      title: 'Entrepreneurship Podcast Episode 5',
      type: 'podcast',
      status: 'planning',
      shootDate: '2024-09-10',
      editDate: '2024-09-12',
      postDate: '2024-09-15',
      teamMember: 'Bob Smith'
    }
  ]);

  const [newContent, setNewContent] = useState({
    title: '',
    type: 'video' as ContentPlan['type'],
    shootDate: '',
    editDate: '',
    postDate: '',
    teamMember: '',
    projectDocument: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createContentPlan = () => {
    if (newContent.title && newContent.shootDate && selectedFile) {
      const plan: ContentPlan = {
        id: Date.now().toString(),
        ...newContent,
        status: 'planning',
        projectDocument: selectedFile.name
      };
      setContentPlans([...contentPlans, plan]);
      setNewContent({
        title: '',
        type: 'video',
        shootDate: '',
        editDate: '',
        postDate: '',
        teamMember: '',
        projectDocument: ''
      });
      setSelectedFile(null);
      setIsDialogOpen(false);
    }
  };

  const getStatusColor = (status: ContentPlan['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-pastel-yellow';
      case 'shoot':
        return 'bg-primary';
      case 'edit':
        return 'bg-pastel-blue';
      case 'post':
        return 'bg-pastel-green';
      case 'completed':
        return 'bg-pastel-lavender';
      default:
        return 'bg-muted';
    }
  };

  const getTypeIcon = (type: ContentPlan['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'podcast':
        return <Users className="w-4 h-4" />;
      case 'blog':
        return <Edit className="w-4 h-4" />;
      case 'social':
        return <Share2 className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const upcomingContent = contentPlans
    .filter(plan => new Date(plan.shootDate) >= new Date())
    .sort((a, b) => new Date(a.shootDate).getTime() - new Date(b.shootDate).getTime());

  return (
    <Layout currentPage="studios">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CIE Studios</h1>
            <p className="text-muted-foreground">Content planning and production management</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Content Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Content Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Content Title</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    placeholder="Enter content title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Content Type</Label>
                  <Select value={newContent.type} onValueChange={(value: ContentPlan['type']) => setNewContent({...newContent, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="shootDate">Shoot Date</Label>
                    <Input
                      id="shootDate"
                      type="date"
                      value={newContent.shootDate}
                      onChange={(e) => setNewContent({...newContent, shootDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editDate">Edit Date</Label>
                    <Input
                      id="editDate"
                      type="date"
                      value={newContent.editDate}
                      onChange={(e) => setNewContent({...newContent, editDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postDate">Post Date</Label>
                    <Input
                      id="postDate"
                      type="date"
                      value={newContent.postDate}
                      onChange={(e) => setNewContent({...newContent, postDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="teamMember">Team Member</Label>
                  <Select value={newContent.teamMember} onValueChange={(value) => setNewContent({...newContent, teamMember: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="document">Project Document *</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    <Upload className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload project brief, script, or storyboard (Required)
                  </p>
                </div>
                
                <Button 
                  onClick={createContentPlan} 
                  className="w-full"
                  disabled={!newContent.title || !newContent.shootDate || !selectedFile}
                >
                  Create Content Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Content Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Video className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold text-foreground">{contentPlans.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">In Production</p>
                <p className="text-2xl font-bold text-foreground">
                  {contentPlans.filter(p => ['shoot', 'edit'].includes(p.status)).length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ready to Post</p>
                <p className="text-2xl font-bold text-foreground">
                  {contentPlans.filter(p => p.status === 'post').length}
                </p>
              </div>
            </div>
          </Card>
          
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Badge className="w-8 h-8 flex items-center justify-center bg-pastel-lavender">✓</Badge>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {contentPlans.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

      {/* Content Calendar */}
      <Card className="p-6 card-soft">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Content Calendar</h2>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="aspect-square border border-border rounded p-1 text-xs">
                <div className="text-foreground">{((i % 31) + 1)}</div>
                {i === 10 && <div className="bg-primary/20 text-primary text-[10px] rounded p-0.5 mt-1">Video Shoot</div>}
                {i === 15 && <div className="bg-academic-instruction/20 text-foreground text-[10px] rounded p-0.5 mt-1">Edit</div>}
              </div>
            ))}
          </div>
        </Card>

      {/* Studio Dashboard */}
      <Card className="p-6 card-soft">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Studio Dashboard</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Team Member</TableHead>
                <TableHead>Shoot Date</TableHead>
                <TableHead>Edit Date</TableHead>
                <TableHead>Post Date</TableHead>
                <TableHead>Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(plan.type)}
                      {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.teamMember}</TableCell>
                  <TableCell>{new Date(plan.shootDate).toLocaleDateString()}</TableCell>
                  <TableCell>{plan.editDate ? new Date(plan.editDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{plan.postDate ? new Date(plan.postDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    {plan.projectDocument ? (
                      <Badge variant="outline" className="text-xs">
                        {plan.projectDocument}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No document</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

      {/* Timeline View */}
      <Card className="p-6 card-soft">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Monthly Timeline</h2>
          <div className="space-y-3">
            {upcomingContent.slice(0, 5).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  {getTypeIcon(plan.type)}
                  <div>
                    <h3 className="font-medium text-foreground">{plan.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Shoot: {new Date(plan.shootDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{plan.teamMember}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}