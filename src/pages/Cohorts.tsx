import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, CheckCircle } from "lucide-react";

interface CohortData {
  projectName: string;
  startDate: string;
  endDate: string;
  activeDays: string[];
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

                    <div className="mt-3 text-sm text-muted-foreground">
                      Duration: {calculateDuration(cohort.startDate, cohort.endDate)} weeks
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
