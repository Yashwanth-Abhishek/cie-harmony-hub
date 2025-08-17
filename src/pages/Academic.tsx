import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import { AcademicCalendar } from "@/components/AcademicCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type AcademicEvent, getEventColor } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Academic years data
const dummyEvents: AcademicEvent[] = [
  // Add dummy events here
];

export default function Academic() {
  const [selectedYear, setSelectedYear] = useState<number>(1); 
  const [allEvents, setAllEvents] = useState<AcademicEvent[]>(dummyEvents);
  
  // Filter events for the selected year
  const filteredEvents = useMemo(() => 
    allEvents.filter(event => event.year === selectedYear),
    [allEvents, selectedYear]
  );

  const handleEventsChange = (updatedEvents: AcademicEvent[]) => {
    // Remove all events for the current year and add the updated ones
    const otherYearEvents = allEvents.filter(event => event.year !== selectedYear);
    setAllEvents([...otherYearEvents, ...updatedEvents]);
  };

  return (
    <Layout currentPage="academic">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Calendar</h1>
            <p className="text-muted-foreground mt-1">Track academic schedules for different years</p>
          </div>
          <div className="flex items-center gap-4">
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {`${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar */}
        <div className="w-full">
          <AcademicCalendar 
            events={filteredEvents}
            onEventsChange={handleEventsChange}
            selectedYear={selectedYear}
            readOnly={false}
          />
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events - Year {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div 
                      key={event.id} 
                      className="flex items-start p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mt-1.5 mr-3 flex-shrink-0"
                        style={{ backgroundColor: getEventColor(event.category) }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{event.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events for this year.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}