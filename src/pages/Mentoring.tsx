import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, Calendar, Edit, Trash2, Save, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MentoringWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  assignedMentor: string;
  substituteMentor?: string;
  isHoliday: boolean;
}

interface SubstituteMentor {
  id: string;
  name: string;
  weekNumber: number;
}

const branches = ["Computer Science", "Electronics", "Mechanical", "Civil"];
const sections = ["A", "B", "C", "D"];

const defaultMentors = ["Dr. Smith", "Prof. Johnson", "Dr. Williams", "Prof. Brown"];

const generateMentoringWeeks = (): MentoringWeek[] => {
  const weeks: MentoringWeek[] = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 8; i++) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    weeks.push({
      weekNumber: i + 1,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      assignedMentor: defaultMentors[i % defaultMentors.length],
      isHoliday: i === 3 // Sample holiday week
    });
    
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return weeks;
};

export default function Mentoring() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [mentoringWeeks, setMentoringWeeks] = useState<MentoringWeek[]>([]);
  const [editingSubstitute, setEditingSubstitute] = useState<number | null>(null);
  const [substituteInput, setSubstituteInput] = useState("");
  
  // Generate weeks when branch and section are selected
  useEffect(() => {
    if (selectedBranch && selectedSection) {
      setMentoringWeeks(generateMentoringWeeks());
    }
  }, [selectedBranch, selectedSection]);

  const totalWeeks = mentoringWeeks.length;
  const workingWeeks = mentoringWeeks.filter(week => !week.isHoliday);
  const holidayWeeks = totalWeeks - workingWeeks.length;

  const addSubstitute = (weekNumber: number) => {
    if (substituteInput.trim()) {
      setMentoringWeeks(prev => prev.map(week => 
        week.weekNumber === weekNumber 
          ? { ...week, substituteMentor: substituteInput.trim() }
          : week
      ));
      setSubstituteInput("");
      setEditingSubstitute(null);
    }
  };

  const removeSubstitute = (weekNumber: number) => {
    setMentoringWeeks(prev => prev.map(week => 
      week.weekNumber === weekNumber 
        ? { ...week, substituteMentor: undefined }
        : week
    ));
  };

  const startEditingSubstitute = (weekNumber: number, currentSubstitute?: string) => {
    setEditingSubstitute(weekNumber);
    setSubstituteInput(currentSubstitute || "");
  };

  const downloadCalendar = () => {
    // Create calendar data for download
    const calendarData = {
      branch: selectedBranch,
      section: selectedSection,
      weeks: mentoringWeeks,
      totalWeeks,
      workingWeeks: workingWeeks.length,
      holidayWeeks
    };
    
    const blob = new Blob([JSON.stringify(calendarData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentoring-program-${selectedBranch}-${selectedSection}.json`;
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
            Download Program
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6 card-soft">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Program Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </Card>

      {/* Program Overview */}
      {selectedBranch && selectedSection && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Weeks</p>
                <p className="text-2xl font-bold text-foreground">{totalWeeks} weeks</p>
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
                <p className="text-2xl font-bold text-foreground">{holidayWeeks} weeks</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Weekly Mentor Assignment */}
      {mentoringWeeks.length > 0 && (
        <Card className="p-6 card-soft">
          <h2 className="text-xl font-semibold mb-4 text-foreground">8-Week Mentor Assignment Plan</h2>
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
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Assigned Mentor:</span>
                    <Badge variant="outline" className="text-foreground">
                      {week.assignedMentor}
                    </Badge>
                  </div>
                  
                  {week.substituteMentor && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">Substitute:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {week.substituteMentor}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => startEditingSubstitute(week.weekNumber, week.substituteMentor)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeSubstitute(week.weekNumber)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {editingSubstitute === week.weekNumber ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={substituteInput}
                        onChange={(e) => setSubstituteInput(e.target.value)}
                        placeholder="Enter substitute mentor name..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addSubstitute(week.weekNumber)}
                      />
                      <Button size="sm" onClick={() => addSubstitute(week.weekNumber)}>
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingSubstitute(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : !week.substituteMentor && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => startEditingSubstitute(week.weekNumber)}
                      className="gap-2"
                    >
                      <UserPlus className="w-3 h-3" />
                      Add Substitute
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