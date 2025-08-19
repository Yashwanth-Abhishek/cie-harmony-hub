import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  type: "workshop" | "cohort" | "event" | "deadline";
}

interface EventsTimelineProps {
  events: Event[];
  className?: string;
  onEventClick?: (event: Event) => void;
  selectedEventId?: string | null;
}

export default function EventsTimeline({ 
  events, 
  className = "",
  onEventClick,
  selectedEventId
}: EventsTimelineProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "workshop": return "bg-pastel-blue/50 text-blue-700";
      case "cohort": return "bg-pastel-green/50 text-green-700";
      case "event": return "bg-pastel-lavender/50 text-purple-700";
      case "deadline": return "bg-pastel-peach/50 text-orange-700";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  const getTimelineDotColor = (type: string) => {
    switch (type) {
      case "workshop": return "primary";
      case "cohort": return "success";
      case "event": return "secondary";
      case "deadline": return "warning";
      default: return "default";
    }
  };

  if (events.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        No upcoming events available
      </div>
    );
  }

  return (
    <Card className={`card-soft ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold text-foreground">
            Upcoming Events & Cohorts
          </h2>
        </div>
        
        <Timeline position="alternate" className="!p-0">
          {events.map((event, index) => (
            <TimelineItem key={event.id}>
              <TimelineSeparator>
                <TimelineDot 
                  color={getTimelineDotColor(event.type) as any}
                  className="!w-4 !h-4"
                />
                {index < events.length - 1 && (
                  <TimelineConnector className="!bg-border" />
                )}
              </TimelineSeparator>
              <TimelineContent className="!py-2 !px-3">
                <Card 
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    selectedEventId === event.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="bg-background/50 rounded-lg p-4 border border-border/30 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground text-sm">{event.title}</h3>
                      <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
