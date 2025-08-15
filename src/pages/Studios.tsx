import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Video, Edit, Share2, Upload, Calendar, Users, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
// SUPABASE CONNECTION: Import the Supabase client for database operations
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// SUPABASE TYPES: Use database types directly
type ContentPlan = Tables<'content_plans'>;

const contentTypes = ['video', 'podcast', 'blog', 'social'];
const statusTypes = ['planning', 'shoot', 'edit', 'post', 'completed'];
const teamMembers = ['Alice Johnson', 'Bob Smith', 'Carol Davis'];

export default function CIEStudios() {
  // SUPABASE DATA: Store content plans from database
  const [contentPlans, setContentPlans] = useState<Tables<'content_plans'>[]>([]);

  // DATA FETCHING: Function to load content plans from Supabase
  // Edit this function to modify how data is fetched
  const fetchContentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('content_plans')
        .select('*')
        .order('shoot_date', { ascending: true });

      if (error) throw error;
      setContentPlans(data || []);
    } catch (error) {
      console.error('Error fetching content plans:', error);
    }
  };

  // COMPONENT INITIALIZATION: Fetch data on component mount
  useEffect(() => {
    fetchContentPlans();
    // Real-time subscription for content_plans
    const subscription = supabase
      .channel('public:content_plans')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_plans' }, () => {
        fetchContentPlans();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const [newContent, setNewContent] = useState({
    title: '',
    type: 'video',
    shoot_date: '',
    edit_date: '',
    post_date: '',
    team_member: '',
    project_document: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // CREATE CONTENT: Function to add new content to Supabase
  // Edit this function to modify how new content is created
  const createContentPlan = async () => {
    if (newContent.title && newContent.shoot_date) {
      try {
        const { data, error } = await supabase
          .from('content_plans')
          .insert([{
            ...newContent,
            status: 'planning',
            project_document: selectedFile ? selectedFile.name : ''
          }])
          .select();

        if (error) throw error;
        
        // Refresh the data
        fetchContentPlans();
        
        setNewContent({
          title: '',
          type: 'video',
          shoot_date: '',
          edit_date: '',
          post_date: '',
          team_member: '',
          project_document: ''
        });
        setSelectedFile(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error creating content plan:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
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

  const getTypeIcon = (type: string) => {
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

  // Remove old upcomingContent and make it always reflect the latest contentPlans
  const getUpcomingContent = () => {
    // Get all content plans with a shoot, edit, or post date in the current or future months
    const now = new Date();
    return contentPlans
      .filter(plan => {
        const shoot = plan.shoot_date && new Date(plan.shoot_date) >= now;
        const edit = plan.edit_date && new Date(plan.edit_date) >= now;
        const post = plan.post_date && new Date(plan.post_date) >= now;
        return shoot || edit || post;
      })
      .sort((a, b) => {
        // Sort by earliest of shoot, edit, or post date
        const aDates = [a.shoot_date, a.edit_date, a.post_date].filter(Boolean).map(d => new Date(d as string));
        const bDates = [b.shoot_date, b.edit_date, b.post_date].filter(Boolean).map(d => new Date(d as string));
        return Math.min(...aDates.map(d => d.getTime())) - Math.min(...bDates.map(d => d.getTime()));
      });
  };
  const upcomingContent = getUpcomingContent();

  // Add state for calendar month navigation
  const [calendarDate, setCalendarDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const handlePrevMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // State for editing and deleting
  const [editPlan, setEditPlan] = useState<Tables<'content_plans'> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ open: boolean, plan: Tables<'content_plans'> | null }>({ open: false, plan: null });

  // Edit handler
  const handleEditPlan = (plan: Tables<'content_plans'>) => {
    setEditPlan(plan);
  };
  const handleEditSave = async (updatedPlan: Tables<'content_plans'>) => {
    await supabase.from('content_plans').update(updatedPlan).eq('id', updatedPlan.id);
    setEditPlan(null);
    fetchContentPlans();
  };
  // Delete handler
  const handleDeletePlan = async (plan: Tables<'content_plans'>) => {
    setShowDeleteConfirm({ open: true, plan });
  };
  const confirmDelete = async () => {
    if (showDeleteConfirm.plan) {
      await supabase.from('content_plans').delete().eq('id', showDeleteConfirm.plan.id);
      setShowDeleteConfirm({ open: false, plan: null });
      fetchContentPlans();
    }
  };

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
                  <Select value={newContent.type} onValueChange={(value) => setNewContent({...newContent, type: value})}>
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
                      value={newContent.shoot_date}
                      onChange={(e) => setNewContent({...newContent, shoot_date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editDate">Edit Date</Label>
                    <Input
                      id="editDate"
                      type="date"
                      value={newContent.edit_date}
                      onChange={(e) => setNewContent({...newContent, edit_date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postDate">Post Date</Label>
                    <Input
                      id="postDate"
                      type="date"
                      value={newContent.post_date}
                      onChange={(e) => setNewContent({...newContent, post_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="teamMember">Team Member</Label>
                  <Input
                    id="teamMember"
                    value={newContent.team_member}
                    onChange={e => setNewContent({ ...newContent, team_member: e.target.value })}
                    placeholder="Enter team member name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="document">Project Document (Optional)</Label>
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
                    Upload project brief, script, or storyboard (Optional)
                  </p>
                </div>
                
                <Button 
                  onClick={createContentPlan} 
                  className="w-full"
                  disabled={!newContent.title || !newContent.shoot_date}
                >
                  Create Content Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

      {/* Content Calendar */}
      <Card className="p-8 card-soft">
        {(() => {
          const yearCal = calendarDate.getFullYear();
          const monthCal = calendarDate.getMonth();
          const monthName = calendarDate.toLocaleString('default', { month: 'long' });
          return (
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-semibold text-foreground mb-0">Content Calendar</h2>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="rounded p-1 hover:bg-muted transition"><ChevronLeft className="w-5 h-5" /></button>
                <span className="text-lg font-medium text-muted-foreground">{monthName} {yearCal}</span>
                <button onClick={handleNextMonth} className="rounded p-1 hover:bg-muted transition"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          );
        })()}
        <div className="grid grid-cols-7 gap-2 text-center text-base">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-3 font-semibold text-muted-foreground text-lg">
              {day}
            </div>
          ))}
          {(() => {
            const yearCal = calendarDate.getFullYear();
            const monthCal = calendarDate.getMonth();
            const firstDayOfMonthCal = new Date(yearCal, monthCal, 1);
            const lastDayOfMonthCal = new Date(yearCal, monthCal + 1, 0);
            const startDayCal = firstDayOfMonthCal.getDay();
            const daysInMonthCal = lastDayOfMonthCal.getDate();
            const totalCellsCal = Math.ceil((startDayCal + daysInMonthCal) / 7) * 7;
            const daysArray = [];
            for (let i = 0; i < totalCellsCal; i++) {
              const dayNum = i - startDayCal + 1;
              const dateObj = new Date(yearCal, monthCal, dayNum);
              const plansForDay = contentPlans.filter(plan => {
                const shoot = plan.shoot_date && new Date(plan.shoot_date).toDateString() === dateObj.toDateString();
                const edit = plan.edit_date && new Date(plan.edit_date).toDateString() === dateObj.toDateString();
                const post = plan.post_date && new Date(plan.post_date).toDateString() === dateObj.toDateString();
                return shoot || edit || post;
              });
              daysArray.push(
                <div key={i} className="aspect-square min-h-[120px] border border-border rounded p-2 text-base bg-white flex flex-col items-center justify-start">
                  <div className="text-foreground font-bold text-lg">{dayNum > 0 && dayNum <= daysInMonthCal ? dayNum : ""}</div>
                  {dayNum > 0 && dayNum <= daysInMonthCal && plansForDay.map((plan, idx) => {
                    let label = '';
                    if (plan.shoot_date && new Date(plan.shoot_date).toDateString() === dateObj.toDateString()) label = 'Shoot Date';
                    else if (plan.edit_date && new Date(plan.edit_date).toDateString() === dateObj.toDateString()) label = 'Edit Date';
                    else if (plan.post_date && new Date(plan.post_date).toDateString() === dateObj.toDateString()) label = 'Post Date';
                    return (
                      <div key={plan.id + idx} className="mt-2 w-full px-2 py-1 rounded text-xs flex flex-col items-center justify-center"
                        style={{ background: plan.status === 'shoot' ? '#c7d2fe' : plan.status === 'edit' ? '#fef9c3' : plan.status === 'post' ? '#bbf7d0' : '#e5e7eb', color: '#111827' }}>
                        <span className="font-semibold text-xs">{plan.title} <span className="text-[10px] text-muted-foreground">({label})</span></span>
                      </div>
                    );
                  })}
                </div>
              );
            }
            return daysArray;
          })()}
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
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentPlans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">No content plans available.</TableCell>
              </TableRow>
            ) : (
              contentPlans.map((plan) => (
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
                  <TableCell>{plan.team_member}</TableCell>
                  <TableCell>{plan.shoot_date ? new Date(plan.shoot_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{plan.edit_date ? new Date(plan.edit_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{plan.post_date ? new Date(plan.post_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    {plan.project_document ? (
                      <Badge variant="outline" className="text-xs">
                        {plan.project_document}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No document</span>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPlan(plan)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePlan(plan)} className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        {editPlan && (
          <Dialog open={!!editPlan} onOpenChange={open => !open && setEditPlan(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Content Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input value={editPlan.title} onChange={e => setEditPlan({ ...editPlan, title: e.target.value })} placeholder="Title" />
                <Select value={editPlan.type} onValueChange={value => setEditPlan({ ...editPlan, type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={editPlan.shoot_date || ''} onChange={e => setEditPlan({ ...editPlan, shoot_date: e.target.value })} />
                <Input type="date" value={editPlan.edit_date || ''} onChange={e => setEditPlan({ ...editPlan, edit_date: e.target.value })} />
                <Input type="date" value={editPlan.post_date || ''} onChange={e => setEditPlan({ ...editPlan, post_date: e.target.value })} />
                <Input value={editPlan.team_member} onChange={e => setEditPlan({ ...editPlan, team_member: e.target.value })} placeholder="Team Member" />
                <Input value={editPlan.project_document || ''} onChange={e => setEditPlan({ ...editPlan, project_document: e.target.value })} placeholder="Project Document" />
                <Select value={editPlan.status} onValueChange={value => setEditPlan({ ...editPlan, status: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusTypes.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditPlan(null)}>Cancel</Button>
                  <Button onClick={() => handleEditSave(editPlan)}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirm Dialog */}
        {showDeleteConfirm.open && (
          <Dialog open={showDeleteConfirm.open} onOpenChange={open => !open && setShowDeleteConfirm({ open: false, plan: null })}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <div className="py-4">Are you sure you want to delete this content plan?</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm({ open: false, plan: null })}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
                      {plan.shoot_date && new Date(plan.shoot_date) >= new Date() && `Shoot: ${new Date(plan.shoot_date).toLocaleDateString()}`}
                      {plan.edit_date && new Date(plan.edit_date) >= new Date() && ` Edit: ${new Date(plan.edit_date).toLocaleDateString()}`}
                      {plan.post_date && new Date(plan.post_date) >= new Date() && ` Post: ${new Date(plan.post_date).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{plan.team_member}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
