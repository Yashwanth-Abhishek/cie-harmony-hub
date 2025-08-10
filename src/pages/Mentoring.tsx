import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface MentoringWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  tasks: { id: string; text: string; completed: boolean }[];
  isHoliday: boolean;
}

interface MentoringTask {
  id: string;
  text: string;
  completed: boolean;
}

const branches = ["Computer Science", "Electronics", "Mechanical", "Civil"];
const sections = ["A", "B", "C", "D"];
const timeSlots = ["Morning (10:10 AM - 11:50 AM)", "Afternoon (2:20 PM - 4:00 PM)"];

const generateMentoringWeeks = (startDate: Date): MentoringWeek[] => {
  const weeks: MentoringWeek[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 8; i++) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    weeks.push({
      weekNumber: i + 1,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      tasks: [
        { id: `${i + 1}-1`, text: `Week ${i + 1} - Orientation and Goal Setting`, completed: false },
        { id: `${i + 1}-2`, text: "Industry insights discussion", completed: false },
        { id: `${i + 1}-3`, text: "Project planning and roadmap", completed: false }
      ],
      isHoliday: i === 3 // Sample holiday week
    });
    
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return weeks;
};

export default function Mentoring() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [startDate, setStartDate] = useState("");
  const [mentoringWeeks, setMentoringWeeks] = useState<MentoringWeek[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  
  // Generate weeks when startDate changes
  useEffect(() => {
    if (startDate) {
      setMentoringWeeks(generateMentoringWeeks(new Date(startDate)));
    }
  }, [startDate]);

  const workingWeeks = mentoringWeeks.filter(week => !week.isHoliday);

  const addTask = (weekNumber: number) => {
    if (newTaskText.trim()) {
      setMentoringWeeks(prev => prev.map(week => 
        week.weekNumber === weekNumber 
          ? {
              ...week,
              tasks: [...week.tasks, {
                id: Date.now().toString(),
                text: newTaskText,
                completed: false
              }]
            }
          : week
      ));
      setNewTaskText("");
      setEditingWeek(null);
    }
  };

  const toggleTask = (weekNumber: number, taskId: string) => {
    setMentoringWeeks(prev => prev.map(week => 
      week.weekNumber === weekNumber 
        ? {
            ...week,
            tasks: week.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : week
    ));
  };

  const downloadCalendar = () => {
    // Create calendar data for download
    const calendarData = {
      branch: selectedBranch,
      section: selectedSection,
      timeSlot: selectedTimeSlot,
      weeks: mentoringWeeks
    };
    
    const blob = new Blob([JSON.stringify(calendarData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentoring-calendar-${selectedBranch}-${selectedSection}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout currentPage="mentoring">
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mentoring Program</h1>
          <p className="text-muted-foreground">8-week mentoring program management</p>
        </div>
        
        {mentoringWeeks.length > 0 && (
          <Button onClick={downloadCalendar} className="gap-2">
            <Download className="w-4 h-4" />
            Download Calendar
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6 card-soft">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Program Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Branch</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Section</label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>Section {section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Time Slot</label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        </div>
      </Card>

      {/* Program Overview */}
      {mentoringWeeks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Weeks</p>
                <p className="text-2xl font-bold text-foreground">8 weeks</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Working Weeks</p>
                <p className="text-2xl font-bold text-foreground">{workingWeeks.length} weeks</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Badge className="w-8 h-8 flex items-center justify-center bg-pastel-yellow">H</Badge>
              <div>
                <p className="text-sm text-muted-foreground">Holiday Weeks</p>
                <p className="text-2xl font-bold text-foreground">{mentoringWeeks.length - workingWeeks.length} weeks</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Weekly Planner */}
      {mentoringWeeks.length > 0 && (
        <Card className="p-6 card-soft">
          <h2 className="text-xl font-semibold mb-4 text-foreground">8-Week Mentoring Plan</h2>
          <div className="space-y-4">
            {mentoringWeeks.map((week) => (
              <div key={week.weekNumber} className={`border rounded-lg p-4 ${week.isHoliday ? 'bg-academic-holidays/20' : 'bg-background'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={week.isHoliday ? "secondary" : "default"}>
                      Week {week.weekNumber}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                    </span>
                    {week.isHoliday && (
                      <Badge variant="outline" className="bg-pastel-yellow text-foreground">
                        Holiday Week
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {week.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={`week-${week.weekNumber}-task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(week.weekNumber, task.id)}
                      />
                      <label htmlFor={`week-${week.weekNumber}-task-${task.id}`} className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.text}
                      </label>
                    </div>
                  ))}
                  
                  {editingWeek === week.weekNumber ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Add new task..."
                        className="flex-1 px-2 py-1 border border-border rounded text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && addTask(week.weekNumber)}
                      />
                      <Button size="sm" onClick={() => addTask(week.weekNumber)}>Add</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingWeek(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingWeek(week.weekNumber)}
                      className="mt-2"
                    >
                      Add Task
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      </div>
    </Layout>
  );
}