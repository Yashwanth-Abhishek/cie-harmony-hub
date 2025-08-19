import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isSameDay as dateFnsIsSameDay } from "date-fns";
import { Button } from "./ui/button";
import { Event as UpcomingEvent } from "./UpcomingEvents";

export interface CalendarEvent {
  id: string;
  title: string;
  type: "instruction" | "exam" | "holiday" | "mentoring" | "studio";
  date: Date;
  description?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateClick: (date: Date, events: CalendarEvent[]) => void;
  selectedEventDate?: Date | null;
  onMonthChange?: (date: Date) => void;
}

export function Calendar({ events, onDateClick, selectedEventDate, onMonthChange }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => dateFnsIsSameDay(event.date, date));
  };

  const getEventTypeColor = (type: CalendarEvent["type"]) => {
    const colors = {
      instruction: "bg-instruction",
      exam: "bg-exam",
      holiday: "bg-holiday",
      mentoring: "bg-mentoring",
      studio: "bg-studio",
    };
    return colors[type];
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    onMonthChange?.(today);
  };

  // Effect to handle external month changes (e.g., when clicking on an event)
  useEffect(() => {
    if (selectedEventDate && !isSameMonth(selectedEventDate, currentDate)) {
      setCurrentDate(selectedEventDate);
    }
  }, [selectedEventDate]);

  const isCurrentMonth = (date: Date) => {
    return isSameMonth(date, currentDate);
  };

  const isCurrentDay = (date: Date) => {
    return isToday(date);
  };

  const generateCalendarGrid = () => {
    const firstDayOfWeek = monthStart.getDay();
    const totalCells = 42; // 6 weeks × 7 days
    const grid = [];

    // Add previous month's trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(monthStart);
      date.setDate(date.getDate() - (i + 1));
      grid.push({ date, isCurrentMonth: false });
    }

    // Add current month days
    calendarDays.forEach(date => {
      grid.push({ date, isCurrentMonth: true });
    });

    // Add next month's leading days
    const remainingCells = totalCells - grid.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + i);
      grid.push({ date, isCurrentMonth: false });
    }

    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTodayClick}
            className="text-xs h-8 px-3"
          >
            Today
          </Button>
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-muted rounded-l-md transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-6 w-px bg-border" />
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-muted rounded-r-md transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarGrid.map(({ date, isCurrentMonth }, index) => {
          const dayEvents = getEventsForDate(date);
          const isToday_ = isToday(date);

          return (
            <button
              key={index}
              onClick={() => onDateClick(date, dayEvents)}
              className={`relative p-2 min-h-[60px] border rounded-lg transition-all hover:bg-muted/50 ${
                isCurrentMonth 
                  ? "bg-background border-border" 
                  : "bg-muted/30 border-transparent text-muted-foreground"
              } ${
                isToday_ ? "ring-2 ring-primary" : ""
              } ${
                selectedEventDate && isSameDay(date, selectedEventDate) 
                  ? "ring-2 ring-primary bg-primary/10" 
                  : ""
              }`}
            >
              <div className={`text-sm font-medium ${
                isToday_ ? "text-primary" : isCurrentMonth ? "text-foreground" : "text-muted-foreground"
              }`}>
                {format(date, "d")}
              </div>
              
              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                        title={event.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}