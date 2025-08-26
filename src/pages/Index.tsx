import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Calendar } from "@/components/Calendar";
import EventsTimeline from "@/components/EventsTimeline";
import CIEAbout from "@/components/CIEAbout";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Event as UpcomingEvent, upcomingEvents as staticUpcomingEvents } from "@/components/UpcomingEvents";

const Index = () => {
  const [events, setEvents] = useState<Tables<'events'>[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  const handleDateClick = (date: Date, dayEvents: any[]) => {
    console.log("Date clicked:", date);
    console.log("Events for this date:", dayEvents);
    // Here you could show event details or navigate to event planning
  };

  const handleEventClick = (event: UpcomingEvent) => {
    setSelectedEvent(event);
    if (event.dateObj) {
      setCurrentMonth(event.dateObj);
    }
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  // Convert database events to new calendar format
  const mapEventType = (dbEventType: string): "instruction" | "exam" | "holiday" | "mentoring" | "studio" => {
    const typeMap: Record<string, "instruction" | "exam" | "holiday" | "mentoring" | "studio"> = {
      'academic': 'instruction',
      'exam': 'exam',
      'holiday': 'holiday',
      'mentoring': 'mentoring',
      'studio': 'studio',
      'workshop': 'instruction',
      'event': 'instruction',
      'deadline': 'exam',
      'sports': 'instruction',
      'cultural': 'instruction'
    };
    
    return typeMap[dbEventType.toLowerCase()] || 'instruction';
  };

  const calendarEvents = events.map(event => ({
    id: event.id.toString(),
    title: event.title,
    type: mapEventType(event.event_type),
    date: new Date(event.event_date),
    description: event.description || undefined,
  }));

  // Use the imported upcoming events
  const upcomingEvents = staticUpcomingEvents;

  return (
    <Layout currentPage="home">
      <div className="space-y-8">
        {/* Main Calendar Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EventsTimeline 
              events={upcomingEvents} 
              onEventClick={handleEventClick}
              selectedEventId={selectedEvent?.id}
            />
          </div>
          <div>
            <Calendar 
              events={calendarEvents} 
              onDateClick={handleDateClick} 
              selectedEventDate={selectedEvent?.dateObj}
              onMonthChange={handleMonthChange}
            />
          </div>
        </div>

        {/* CIE Information Section */}
        <CIEAbout />
      </div>
    </Layout>
  );
};

export default Index;
