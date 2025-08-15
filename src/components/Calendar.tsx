import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Trash2, Edit2, Calendar as CalendarIcon, BookOpen, Bookmark, GraduationCap, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEventColor, getEventType, type AcademicEvent, type EventType } from "@/lib/events";

export interface CalendarEvent {
  id: string;
  name: string;
  date: string;
  type: "holiday" | "instruction" | "exam" | "event";
  category: string;
  description: string;
  color: string;
  year: number;
}

interface CalendarProps {
  events?: AcademicEvent[];
  onEventUpdate?: (events: AcademicEvent[]) => void;
  showLegend?: boolean;
  readOnly?: boolean;
  selectedYear: number;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sample events for demonstration
const categoryIcons = {
  'Exams': <BookOpen className="h-4 w-4" />,
  'Events': <CalendarPlus className="h-4 w-4" />,
  'Holidays': <CalendarIcon className="h-4 w-4" />,
  'Instruction Days': <GraduationCap className="h-4 w-4" />
};

export default function Calendar({ 
  events = [], 
  onEventUpdate, 
  showLegend = true, 
  readOnly = false,
  selectedYear,
}: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<AcademicEvent, 'id' | 'date'>>({ 
    name: '',
    category: 'Events',
    description: '',
    type: 'event',
    color: getEventColor('Events'),
    year: selectedYear,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  const handleDateClick = (date: Date) => {
    if (readOnly) return;
    
    const dateStr = date.toISOString().split('T')[0];
    const event = getEventForDate(date);
    
    setSelectedDate(date);
    
    if (event) {
      setSelectedEvent(event);
    } else {
      setNewEvent({
        name: '',
        category: 'Events',
        description: '',
        type: 'event',
        color: getEventColor('Events'),
        year: selectedYear,
      });
      setIsEditing(true);
    }
  };

  const handleSaveEvent = () => {
    if (!selectedDate || !newEvent.name || !newEvent.category) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const eventToSave: AcademicEvent = {
      id: selectedEvent?.id || `event-${Date.now()}`,
      name: newEvent.name,
      date: dateStr,
      category: newEvent.category as any,
      description: newEvent.description || '',
      type: newEvent.type,
      color: newEvent.color,
      year: selectedYear,
    };

    const updatedEvents = selectedEvent
      ? events.map(e => e.id === selectedEvent.id ? eventToSave : e)
      : [...events, eventToSave];

    onEventUpdate?.(updatedEvents);
    setSelectedEvent(null);
    setIsEditing(false);
    setNewEvent({ 
      name: '', 
      category: 'Events', 
      description: '',
      type: 'event',
      color: getEventColor('Events'),
      year: selectedYear,
    });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
    onEventUpdate?.(updatedEvents);
    setSelectedEvent(null);
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    setNewEvent({
      name: selectedEvent.name,
      category: selectedEvent.category,
      description: selectedEvent.description,
      type: selectedEvent.type,
      color: selectedEvent.color,
      year: selectedEvent.year
    });
    setIsEditing(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setNewEvent({ 
      name: '', 
      category: 'Events', 
      description: '',
      type: 'event',
      color: getEventColor('Events'),
      year: selectedYear,
    });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSunday = (date: Date) => {
    return date.getDay() === 0;
  };

  return (
    <div className="space-y-6 relative">
      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent || isEditing} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? (selectedEvent ? 'Edit Event' : 'Add New Event') : 'Event Details'}
            </DialogTitle>
          </DialogHeader>
          
          {isEditing ? (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Name</label>
                <Input
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Enter event name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newEvent.category}
                  onValueChange={(value: EventType) => setNewEvent({...newEvent, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryIcons).map(([category, icon]) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          {icon}
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Select
                  value={newEvent.year.toString()}
                  onValueChange={(value) => setNewEvent({...newEvent, year: parseInt(value, 10)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {`${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ) : selectedEvent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedEvent.color }}
                ></div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedEvent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEvent.category}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm">{selectedEvent.description}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-muted-foreground">{selectedEvent.year}</p>
              </div>
            </div>
          ) : null}
          
          <DialogFooter className="sm:justify-between">
            {!isEditing && selectedEvent && (
              <Button
                variant="destructive"
                className="mr-auto"
                onClick={handleDeleteEvent}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            
            <Button variant="outline" onClick={closeModal}>
              {isEditing ? 'Cancel' : 'Close'}
            </Button>
            
            {isEditing ? (
              <Button onClick={handleSaveEvent} disabled={!newEvent.name}>
                Save Changes
              </Button>
            ) : selectedEvent ? (
              <Button onClick={handleEditEvent}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: getEventColor(category) }}
              ></div>
              <span className="text-sm text-muted-foreground">{category}</span>
            </div>
          ))}
          {!readOnly && (
            <div className="text-xs text-muted-foreground ml-auto self-center">
              Click on any day to add/edit events
            </div>
          )}
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
            const isClickable = !readOnly && isCurrentMonthDay;

            return (
              <div
                key={index}
                onClick={() => isClickable && handleDateClick(date)}
                className={cn(
                  "calendar-day min-h-[80px] border-r border-b border-border/30 last:border-r-0 relative p-1",
                  !isCurrentMonthDay && "text-muted-foreground/50 bg-muted/20",
                  isTodayDate && "bg-primary/10 border-primary/30",
                  isSunday(date) && !event && "bg-[#FFF8DC]/70", // Pastel yellow for Sundays without events
                  isClickable && "cursor-pointer hover:bg-accent/30 transition-colors",
                  event && "font-medium"
                )}
                style={event ? { 
                  backgroundColor: event.color,
                  borderLeft: `4px solid ${event.color}`,
                  borderColor: 'hsl(var(--border))'
                } : {}}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-sm font-medium",
                      isTodayDate && "text-primary font-bold"
                    )}>
                      {date.getDate()}
                    </span>
                    {event && (
                      <span className="text-[10px] opacity-70">
                        {event.category.split(' ').map(word => word[0]).join('')}
                      </span>
                    )}
                  </div>
                  {event && (
                    <div className="mt-1 flex-1 overflow-hidden">
                      <div className="text-xs px-1.5 py-0.5 bg-white/90 dark:bg-background/90 rounded text-foreground/90 font-medium truncate">
                        {event.name}
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