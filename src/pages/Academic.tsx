import { useState } from "react";
import Layout from "@/components/Layout";
import Calendar from "@/components/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Academic calendar data for different years
const academicData = {
  "1st Year": {
    periods: [
      { name: "Fall Semester", start: "2024-08-26", end: "2024-12-20", color: "pastel-blue" },
      { name: "Spring Semester", start: "2024-01-15", end: "2024-05-30", color: "pastel-green" },
      { name: "Summer Session", start: "2024-06-03", end: "2024-07-26", color: "pastel-yellow" }
    ]
  },
  "2nd Year": {
    periods: [
      { name: "Fall Semester", start: "2024-08-19", end: "2024-12-13", color: "pastel-blue" },
      { name: "Spring Semester", start: "2024-01-08", end: "2024-05-23", color: "pastel-green" },
      { name: "Summer Internship", start: "2024-06-01", end: "2024-08-15", color: "pastel-peach" }
    ]
  },
  "3rd Year": {
    periods: [
      { name: "Fall Semester", start: "2024-08-12", end: "2024-12-06", color: "pastel-blue" },
      { name: "Spring Semester", start: "2024-01-01", end: "2024-05-16", color: "pastel-green" },
      { name: "Industry Project", start: "2024-05-20", end: "2024-08-10", color: "pastel-lavender" }
    ]
  },
  "4th Year": {
    periods: [
      { name: "Final Semester", start: "2024-08-05", end: "2024-11-30", color: "pastel-blue" },
      { name: "Thesis Period", start: "2024-12-01", end: "2024-04-30", color: "pastel-peach" },
      { name: "Graduation Prep", start: "2024-05-01", end: "2024-05-31", color: "pastel-green" }
    ]
  }
};

const generateAcademicEvents = (year: string) => {
  const yearData = academicData[year as keyof typeof academicData];
  const events = [];
  
  yearData.periods.forEach((period, index) => {
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    
    // Generate events for each day in the period
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      events.push({
        id: `${year}-${index}-${currentDate.getTime()}`,
        title: period.name,
        date: currentDate.toISOString().split('T')[0],
        type: "instruction" as const,
        color: period.color
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  
  return events;
};


export default function Academic() {
  const [selectedYear, setSelectedYear] = useState<string>("1st Year");
  const academicEvents = generateAcademicEvents(selectedYear);
  
  return (
    <Layout currentPage="academic">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Calendar</h1>
            <p className="text-muted-foreground mt-1">Track academic schedules for different years</p>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Year">1st Year</SelectItem>
              <SelectItem value="2nd Year">2nd Year</SelectItem>
              <SelectItem value="3rd Year">3rd Year</SelectItem>
              <SelectItem value="4th Year">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendar with Academic Filters */}
        <Calendar events={academicEvents} showLegend={true} />

        {/* Academic Schedule Table */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle>Academic Schedule Breakdown - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {academicData[selectedYear as keyof typeof academicData].periods.map((period, index) => {
                const startDate = new Date(period.start);
                const endDate = new Date(period.end);
                const diffTime = endDate.getTime() - startDate.getTime();
                const weeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
                
                return (
                  <div key={index} className="border border-border/40 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">{period.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full bg-${period.color}`}></div>
                        <Badge variant="outline" className="bg-pastel-blue/30">
                          {weeks} weeks
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Start Date:</span>
                        <p className="text-foreground">{startDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">End Date:</span>
                        <p className="text-foreground">{endDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}