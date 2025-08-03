import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Clock, CheckCircle, Circle } from "lucide-react";

const branches = ["Computer Science", "Electronics", "Mechanical", "Civil"];
const sections = ["A", "B", "C", "D"];

const mentoringPrograms = [
  {
    id: "1",
    title: "Product Development Mentoring",
    branch: "Computer Science",
    section: "A",
    startDate: "2024-03-01",
    duration: 8,
    timeSlot: "Morning (9:00 AM - 11:00 AM)",
    mentor: "Dr. Sarah Johnson",
    studentsCount: 25
  },
  {
    id: "2", 
    title: "Innovation & Entrepreneurship",
    branch: "Electronics",
    section: "B",
    startDate: "2024-03-08",
    duration: 8,
    timeSlot: "Afternoon (2:00 PM - 4:00 PM)",
    mentor: "Prof. Michael Chen",
    studentsCount: 20
  }
];

const weeklyPlan = [
  { week: 1, topic: "Introduction & Goal Setting", tasks: ["Self Assessment", "Goal Definition", "Mentor Introduction"] },
  { week: 2, topic: "Skill Gap Analysis", tasks: ["Skill Mapping", "Industry Requirements", "Learning Path"] },
  { week: 3, topic: "Project Planning", tasks: ["Project Selection", "Timeline Creation", "Resource Planning"] },
  { week: 4, topic: "Implementation Phase 1", tasks: ["Project Kickoff", "Initial Development", "Progress Review"] },
  { week: 5, topic: "Mid-Program Review", tasks: ["Progress Assessment", "Feedback Session", "Course Correction"] },
  { week: 6, topic: "Implementation Phase 2", tasks: ["Advanced Development", "Testing", "Refinement"] },
  { week: 7, topic: "Presentation Preparation", tasks: ["Demo Preparation", "Documentation", "Pitch Practice"] },
  { week: 8, topic: "Final Presentation", tasks: ["Project Demo", "Peer Review", "Future Planning"] }
];

export default function Mentoring() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<typeof mentoringPrograms[0] | null>(null);

  const filteredPrograms = mentoringPrograms.filter(program => 
    (!selectedBranch || selectedBranch === "all-branches" || program.branch === selectedBranch) &&
    (!selectedSection || selectedSection === "all-sections" || program.section === selectedSection)
  );

  const calculateWorkingWeeks = (startDate: string, totalWeeks: number) => {
    // Simplified calculation - in real app, this would account for actual holidays
    const holidays = 1; // Assuming 1 week of holidays in 8 weeks
    return totalWeeks - holidays;
  };

  return (
    <Layout currentPage="mentoring">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mentoring Programs</h1>
            <p className="text-muted-foreground mt-1">8-week structured mentoring for students</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="card-soft">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-branches">All Branches</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-sections">All Sections</SelectItem>
                    {sections.map(section => (
                      <SelectItem key={section} value={section}>Section {section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentoring Programs List */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPrograms.map(program => {
            const workingWeeks = calculateWorkingWeeks(program.startDate, program.duration);
            
            return (
              <Card key={program.id} className="card-pastel cursor-pointer hover:shadow-lg transition-all" 
                    onClick={() => setSelectedProgram(program)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <Badge variant="outline" className="bg-pastel-green/30">
                      {program.duration} weeks
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Branch:</span>
                      <p className="font-medium">{program.branch}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Section:</span>
                      <p className="font-medium">{program.section}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>
                      <p className="font-medium">{new Date(program.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p className="font-medium">{program.timeSlot}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Mentor: {program.mentor}</span>
                      <Badge variant="secondary">{program.studentsCount} students</Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-pastel-green font-medium">{workingWeeks} working weeks</span>
                      <span className="text-muted-foreground"> (excluding holidays)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Weekly Planner */}
        {selectedProgram && (
          <Card className="card-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Planner - {selectedProgram.title}
                </CardTitle>
                <Button variant="outline" size="sm" className="btn-pastel">
                  <Download className="h-4 w-4 mr-2" />
                  Download Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyPlan.map((week) => (
                  <div key={week.week} className="border border-border/40 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-primary/10">
                          Week {week.week}
                        </Badge>
                        <h3 className="font-semibold text-foreground">{week.topic}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {selectedProgram.timeSlot}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {week.tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Circle className="h-4 w-4 text-muted-foreground" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}