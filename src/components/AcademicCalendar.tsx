import { useState, useMemo } from 'react';
import Calendar from './Calendar';
import { dummyEvents, type AcademicEvent } from '@/lib/events';

interface AcademicCalendarProps {
  events?: AcademicEvent[];
  onEventsChange?: (events: AcademicEvent[]) => void;
  selectedYear: number;
  readOnly?: boolean;
  [key: string]: any;
}

export function AcademicCalendar({
  events: propEvents = [],
  onEventsChange,
  selectedYear,
  readOnly = false,
  ...props
}: AcademicCalendarProps) {
  // Use propEvents directly, fallback to dummyEvents if empty
  const events = propEvents.length === 0 ? dummyEvents : propEvents;

  const handleEventsChange = (updatedEvents: AcademicEvent[]) => {
    // Add the selected year to each event
    const eventsWithYear = updatedEvents.map(event => ({
      ...event,
      year: selectedYear
    }));
    onEventsChange?.(eventsWithYear);
  };

  return (
    <Calendar
      {...props}
      events={events}
      onEventUpdate={handleEventsChange}
      readOnly={readOnly}
      selectedYear={selectedYear}
      showLegend={true}
    />
  );
}
