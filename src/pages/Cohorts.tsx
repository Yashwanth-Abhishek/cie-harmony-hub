import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, CheckCircle, Upload, FileText, Clock } from "lucide-react";

interface CohortData {
  projectName: string;
  startDate: string;
  endDate: string;
  activeDays: string[];
}

interface Task {
  id: string;
  name: string;
  deadline: string;
  completed: boolean;
}

interface CohortPlan {
  id: string;
  cohortId: string;
  tasks: Task[];
  document?: File;
}

const weekDays = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" }
];

const existingCohorts = [
  {
    id: "1",
    projectName: "AI-Powered Learning Platform",
    startDate: "2024-03-01",
    endDate: "2024-04-26",
    activeDays: ["monday", "wednesday", "friday"],
    participants: 12,
    status: "active",
    progress: 45
  },
  {
    id: "2",
    projectName: "Sustainable Energy Monitor",
    startDate: "2024-02-15", 
    endDate: "2024-04-10",
    activeDays: ["tuesday", "thursday"],
    participants: 8,
    status: "active",
    progress: 65
  },
  {
    id: "3",
    projectName: "Campus Food Delivery App",
    startDate: "2024-01-20",
    endDate: "2024-03-15",
    activeDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    participants: 15,
    status: "completed",
    progress: 100
  }
];

export default function Cohorts() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<typeof existingCohorts[0] | null>(null);
  const [showTaskPlanner, setShowTaskPlanner] = useState(false);
  const [cohortPlans, setCohortPlans] = useState<CohortPlan[]>([]);
  const [newTask, setNewTask] = useState({ name: "", deadline: "" });
  const [cohortForm, setCohortForm] = useState<CohortData>({
    projectName: "",
    startDate: "",
    endDate: "",
    activeDays: []
  });

  const handleDayToggle = (dayId: string, checked: boolean) => {
    setCohortForm(prev => ({
      ...prev,
      activeDays: checked 
        ? [...prev.activeDays, dayId]
        : prev.activeDays.filter(day => day !== dayId)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-pastel-green/50 text-green-700";
      case "completed": return "bg-pastel-blue/50 text-blue-700";
      case "planning": return "bg-pastel-yellow/50 text-yellow-700";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const addTask = () => {
    if (newTask.name && newTask.deadline && selectedCohort) {
      const task: Task = {
        id: Date.now().toString(),
        name: newTask.name,
        deadline: newTask.deadline,
        completed: false
      };

      const existingPlan = cohortPlans.find(plan => plan.cohortId === selectedCohort.id);
      if (existingPlan) {
        setCohortPlans(prev => 
          prev.map(plan => 
            plan.cohortId === selectedCohort.id 
              ? { ...plan, tasks: [...plan.tasks, task] }
              : plan
          )
        );
      } else {
        const newPlan: CohortPlan = {
          id: Date.now().toString(),
          cohortId: selectedCohort.id,
          tasks: [task]
        };
        setCohortPlans(prev => [...prev, newPlan]);
      }

      setNewTask({ name: "", deadline: "" });
    }
  };

  const toggleTask = (taskId: string) => {
    if (selectedCohort) {
      setCohortPlans(prev =>
        prev.map(plan =>
          plan.cohortId === selectedCohort.id
            ? {
                ...plan,
                tasks: plan.tasks.map(task =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                )
              }
            : plan
        )
      );
    }
  };

  const getCurrentCohortPlan = () => {
    return selectedCohort ? cohortPlans.find(plan => plan.cohortId === selectedCohort.id) : null;
  };

  return (
    <Layout currentPage="cohorts">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Development Cohorts</h1>
            <p className="text-muted-foreground mt-1">Manage development cohorts with custom schedules</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="btn-pastel"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Cohort
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Existing Cohorts */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-soft">
              <CardHeader>
                <CardTitle>Active & Recent Cohorts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingCohorts.map(cohort => (
                  <div key={cohort.id} className="border border-border/40 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{cohort.projectName}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {cohort.participants} participants
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(cohort.status)}>
                          {cohort.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {cohort.progress}% complete
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Active Days:</div>
                      <div className="flex flex-wrap gap-1">
                        {cohort.activeDays.map(day => (
                          <Badge key={day} variant="outline" className="bg-pastel-blue/20 text-xs">
                            {weekDays.find(d => d.id === day)?.label.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pastel-green to-pastel-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${cohort.progress}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Duration: {calculateDuration(cohort.startDate, cohort.endDate)} weeks
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCohort(cohort);
                          setShowTaskPlanner(true);
                        }}
                        className="btn-soft"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Plan Tasks
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Create Cohort Form */}
          <div>
            {showCreateForm && (
              <Card className="card-pastel">
                <CardHeader>
                  <CardTitle className="text-lg">Create New Cohort</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Project Name</label>
                    <Input 
                      value={cohortForm.projectName}
                      onChange={(e) => setCohortForm(prev => ({ ...prev, projectName: e.target.value }))}
                      placeholder="Enter project name"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input 
                        type="date"
                        value={cohortForm.startDate}
                        onChange={(e) => setCohortForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input 
                        type="date"
                        value={cohortForm.endDate}
                        onChange={(e) => setCohortForm(prev => ({ ...prev, endDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">Weekly Planning Timeline</label>
                    <div className="space-y-2">
                      {weekDays.map(day => (
                        <div key={day.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={day.id}
                            checked={cohortForm.activeDays.includes(day.id)}
                            onCheckedChange={(checked) => handleDayToggle(day.id, checked as boolean)}
                          />
                          <label htmlFor={day.id} className="text-sm font-medium">
                            {day.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {cohortForm.startDate && cohortForm.endDate && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium">Duration Preview:</div>
                      <div className="text-sm text-muted-foreground">
                        {calculateDuration(cohortForm.startDate, cohortForm.endDate)} weeks
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active days: {cohortForm.activeDays.length} per week
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1 btn-pastel">
                      Create Cohort
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg">Cohort Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Cohorts</span>
                  <Badge variant="outline" className="bg-pastel-green/30">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Participants</span>
                  <Badge variant="outline" className="bg-pastel-blue/30">20</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed Projects</span>
                  <Badge variant="outline" className="bg-pastel-lavender/30">15</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Task Planner Modal */}
            {showTaskPlanner && selectedCohort && (
              <Card className="card-pastel">
                <CardHeader>
                  <CardTitle className="text-lg">Task Planner - {selectedCohort.projectName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Document */}
                  <div>
                    <label className="text-sm font-medium">Cohort Plan Document</label>
                    <div className="mt-1 border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-border transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Upload cohort plan document
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, or TXT files only
                      </p>
                    </div>
                  </div>

                  {/* Add New Task */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Task Name</label>
                      <Input
                        value={newTask.name}
                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter task name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <Input
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button onClick={addTask} className="w-full btn-pastel">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>

                  {/* Task List */}
                  {getCurrentCohortPlan()?.tasks && getCurrentCohortPlan()!.tasks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Tasks & Deadlines</h4>
                      {getCurrentCohortPlan()!.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 border border-border/40 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                            />
                            <div>
                              <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.name}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(task.deadline).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowTaskPlanner(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
