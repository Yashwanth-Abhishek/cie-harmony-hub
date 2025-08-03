import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "holiday" | "instruction" | "exam" | "event";
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  showLegend?: boolean;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sample events for demonstration
const sampleEvents: CalendarEvent[] = [
  { id: "1", title: "Republic Day", date: "2024-01-26", type: "holiday" },
  { id: "2", title: "Mid Semester Exam", date: "2024-02-15", type: "exam" },
  { id: "3", title: "CIE Workshop", date: "2024-02-20", type: "event" },
  { id: "4", title: "Independence Day", date: "2024-08-15", type: "holiday" },
];

export default function Calendar({ events = sampleEvents, onDateClick, showLegend = true }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days = [];
  const currentDateForLoop = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDateForLoop));
    currentDateForLoop.setDate(currentDateForLoop.getDate() + 1);
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getEventForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.find(event => event.date === dateStr);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {monthNames[month]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-academic-holiday rounded"></div>
            <span className="text-sm text-muted-foreground">Holidays</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-academic-instruction rounded"></div>
            <span className="text-sm text-muted-foreground">Instruction Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-academic-exam rounded"></div>
            <span className="text-sm text-muted-foreground">Exams</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pastel-blue rounded"></div>
            <span className="text-sm text-muted-foreground">Events</span>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-card rounded-lg border border-border/50 overflow-hidden shadow-sm">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-muted/50">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border/30 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const event = getEventForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                onClick={() => onDateClick?.(date)}
                className={cn(
                  "calendar-day min-h-[80px] border-r border-b border-border/30 last:border-r-0",
                  !isCurrentMonthDay && "text-muted-foreground/50 bg-muted/20",
                  isTodayDate && "bg-primary/10 border-primary/30",
                  event && `${event.type}`,
                  onDateClick && "cursor-pointer hover:bg-accent/70"
                )}
              >
                <div className="flex flex-col h-full">
                  <span className={cn(
                    "text-sm font-medium",
                    isTodayDate && "text-primary font-bold"
                  )}>
                    {date.getDate()}
                  </span>
                  {event && (
                    <div className="mt-1 flex-1">
                      <div className="text-xs px-1 py-0.5 bg-white/70 rounded text-foreground/80 truncate">
                        {event.title}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}