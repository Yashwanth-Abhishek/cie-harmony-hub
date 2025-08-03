import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  type: "workshop" | "cohort" | "event" | "deadline";
}

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Startup Pitch Workshop",
    date: "2024-02-25",
    time: "10:00 AM",
    description: "Learn the art of pitching your startup idea to investors and stakeholders.",
    location: "CIE Innovation Lab",
    type: "workshop"
  },
  {
    id: "2",
    title: "Product Development Cohort Begins",
    date: "2024-03-01",
    time: "9:00 AM",
    description: "8-week intensive program for product development and market validation.",
    location: "CIE Main Hall",
    type: "cohort"
  },
  {
    id: "3",
    title: "Mentor Connect Session",
    date: "2024-03-05",
    time: "2:00 PM",
    description: "Connect with industry mentors for guidance and networking.",
    location: "Virtual Meeting",
    type: "event"
  }
];

export default function UpcomingEvents() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "workshop": return "bg-pastel-blue/50 text-blue-700";
      case "cohort": return "bg-pastel-green/50 text-green-700";
      case "event": return "bg-pastel-lavender/50 text-purple-700";
      case "deadline": return "bg-pastel-peach/50 text-orange-700";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <Card className="card-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5" />
          Upcoming Events & Cohorts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="border border-border/40 rounded-lg p-4 hover:shadow-md transition-shadow bg-background/50">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{event.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                {event.type}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}