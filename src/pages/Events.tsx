import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Calendar from "@/components/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface EventFormData {
  title: string;
  date: string;
  description: string;
  venue: string;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  type: "event";
  venue?: string;
  description?: string;
}

export default function Events() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [events, setEvents] = useState<Tables<'events'>[]>([
    {
      id: 'event-1',
      title: 'AARAMBA',
      description: 'AARAMBA - Welcome Event',
      event_date: '2025-08-20',
      venue: 'CIE Building',
      type: 'event',
      created_at: new Date().toISOString()
    },
    {
      id: 'event-2',
      title: 'CIE-Orientation day',
      description: 'Orientation day for new students',
      event_date: '2025-08-23',
      venue: 'CIE Building',
      type: 'event',
      created_at: new Date().toISOString()
    }
  ]);
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    date: "",
    description: "",
    venue: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEventForm(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
    setShowCreateForm(true);
  };

  const calculateWorkingDays = (targetDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    let workingDays = 0;
    const current = new Date(today);
    current.setDate(current.getDate() + 1); // Start counting from tomorrow
    
    while (current <= target) {
      const day = current.getDay();
      const dateStr = current.toISOString().split('T')[0];
      
      // Skip only Sundays (0) and holidays
      const isHoliday = dateStr === "2024-01-26" || dateStr === "2024-08-15" || 
                       dateStr === "2024-03-25" || dateStr === "2024-10-02";
      
      if (day !== 0 && !isHoliday) {
        workingDays++;
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return workingDays;
  };

  const checkConflicts = (date: Date) => {
    const conflicts = [];
    const day = date.getDay();
    
    // Check for weekends
    if (day === 0 || day === 6) {
      conflicts.push("Weekend");
    }
    
    // Mock exam periods (in real app, this would check actual academic calendar)
    const month = date.getMonth();
    if (month === 2 || month === 4) { // March or May
      conflicts.push("Exam Period");
    }
    
    // Mock holiday check
    const dateStr = date.toISOString().split('T')[0];
    if (dateStr === "2024-03-25" || dateStr === "2024-08-15") {
      conflicts.push("Public Holiday");
    }
    
    return conflicts;
  };

  const workingDaysLeft = selectedDate ? calculateWorkingDays(selectedDate) : 0;
  const conflicts = selectedDate ? checkConflicts(selectedDate) : [];

  const handleCreateEvent = async () => {
    if (eventForm.title && eventForm.date) {
      try {
        const { error } = await supabase
          .from('events')
          .insert({
            title: eventForm.title,
            event_date: eventForm.date,
            description: eventForm.description,
            venue: eventForm.venue,
            event_type: 'event'
          });

        if (error) throw error;
        
        // Refresh events
        await fetchEvents();
        setEventForm({ title: "", date: "", description: "", venue: "" });
        setShowCreateForm(false);
        setSelectedDate(null);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
  };

  // Sample holidays
  const holidays = [
    { id: "h1", title: "Republic Day", date: "2024-01-26", type: "holiday" as const },
    { id: "h2", title: "Independence Day", date: "2024-08-15", type: "holiday" as const },
    { id: "h3", title: "Holi", date: "2024-03-25", type: "holiday" as const },
    { id: "h4", title: "Gandhi Jayanti", date: "2024-10-02", type: "holiday" as const }
  ];

  // Convert database events to calendar format and combine with holidays
  const calendarEvents = [
    ...events.map(event => ({
      id: event.id.toString(),
      title: event.title,
      date: event.event_date,
      type: "event" as const,
      description: event.description
    })),
    ...holidays
  ];

  return (
    <Layout currentPage="events">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Planning</h1>
            <p className="text-muted-foreground mt-1">Plan and manage CIE events with smart scheduling</p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="btn-pastel"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar events={calendarEvents} onDateClick={handleDateClick} />
          </div>

          {/* Event Planning Panel */}
          <div className="space-y-6">
            {/* Date Info */}
            {selectedDate && (
              <Card className="card-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Date</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {selectedDate.getDate()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Working days left:</span>
                      <Badge variant="outline" className="bg-pastel-blue/30">
                        {workingDaysLeft} days
                      </Badge>
                    </div>

                    {conflicts.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          Conflicts Detected
                        </div>
                        {conflicts.map((conflict, index) => (
                          <Badge key={index} variant="destructive" className="mr-1">
                            {conflict}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create Event Form */}
            {showCreateForm && (
              <Card className="card-pastel">
                <CardHeader>
                  <CardTitle className="text-lg">Create New Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Event Title</label>
                    <Input 
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter event title"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Venue</label>
                    <Input 
                      value={eventForm.venue}
                      onChange={(e) => setEventForm(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="Event venue"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Event description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 btn-pastel"
                      onClick={handleCreateEvent}
                    >
                      Create Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Countdown Widget */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Next Event Countdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">15</div>
                  <div className="text-sm text-muted-foreground">Days until Innovation Workshop</div>
                  <div className="text-xs text-muted-foreground mt-1">March 15, 2024</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}