import Layout from "@/components/Layout";
import Calendar from "@/components/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample academic calendar data
const academicEvents = [
  { id: "1", title: "Semester Begins", date: "2024-02-01", type: "instruction" as const },
  { id: "2", title: "Mid Semester Exam", date: "2024-03-15", type: "exam" as const },
  { id: "3", title: "Spring Break", date: "2024-03-25", type: "holiday" as const },
  { id: "4", title: "Final Exams", date: "2024-05-20", type: "exam" as const },
];

const academicSchedule = [
  {
    period: "Spring Semester 2024",
    startDate: "February 1, 2024",
    endDate: "May 30, 2024",
    instructionalWeeks: 16,
    breaks: ["Spring Break: March 25-29", "Easter Holiday: March 29"]
  },
  {
    period: "Summer Session 2024",
    startDate: "June 3, 2024",
    endDate: "July 26, 2024",
    instructionalWeeks: 8,
    breaks: ["Independence Day: July 4"]
  },
  {
    period: "Fall Semester 2024",
    startDate: "August 26, 2024",
    endDate: "December 20, 2024",
    instructionalWeeks: 16,
    breaks: ["Thanksgiving Break: November 25-29", "Winter Break: December 21 - January 15"]
  }
];

export default function Academic() {
  return (
    <Layout currentPage="academic">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Calendar</h1>
            <p className="text-muted-foreground mt-1">Track academic schedules, exams, and important dates</p>
          </div>
        </div>

        {/* Calendar with Academic Filters */}
        <Calendar events={academicEvents} showLegend={true} />

        {/* Academic Schedule Table */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle>Academic Schedule Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {academicSchedule.map((semester, index) => (
                <div key={index} className="border border-border/40 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{semester.period}</h3>
                    <Badge variant="outline" className="bg-pastel-blue/30">
                      {semester.instructionalWeeks} weeks
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Start Date:</span>
                      <p className="text-foreground">{semester.startDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">End Date:</span>
                      <p className="text-foreground">{semester.endDate}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-muted-foreground block mb-2">Breaks & Holidays:</span>
                    <div className="flex flex-wrap gap-2">
                      {semester.breaks.map((breakPeriod, breakIndex) => (
                        <Badge key={breakIndex} variant="secondary" className="bg-academic-holiday/30">
                          {breakPeriod}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}