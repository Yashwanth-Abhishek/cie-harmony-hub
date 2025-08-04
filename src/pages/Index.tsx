import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Calendar from "@/components/Calendar";
import UpcomingEvents from "@/components/UpcomingEvents";
import CIEAbout from "@/components/CIEAbout";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const Index = () => {
  const [events, setEvents] = useState<Tables<'events'>[]>([]);

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
    console.log("Date clicked:", date);
    // Here you could show event details or navigate to event planning
  };

  // Convert database events to calendar format
  const calendarEvents = events.map(event => ({
    id: event.id.toString(),
    title: event.title,
    date: event.event_date,
    type: "event" as const,
    color: getEventColor(event.event_type),
  }));

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'academic': return '#3b82f6';
      case 'exam': return '#ef4444';
      case 'holiday': return '#10b981';
      case 'sports': return '#f59e0b';
      case 'cultural': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <Layout currentPage="home">
      <div className="space-y-8">
        {/* Main Calendar Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar events={calendarEvents} onDateClick={handleDateClick} />
          </div>
          <div>
            <UpcomingEvents />
          </div>
        </div>

        {/* CIE Information Section */}
        <CIEAbout />
      </div>
    </Layout>
  );
};

export default Index;
