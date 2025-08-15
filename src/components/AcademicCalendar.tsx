import { useState } from 'react';
import Calendar from './Calendar';
import { dummyEvents, type AcademicEvent } from '@/lib/events';

interface AcademicCalendarProps {
  events?: AcademicEvent[];
  onEventsChange?: (events: AcademicEvent[]) => void;
  readOnly?: boolean;
  [key: string]: any;
}

export function AcademicCalendar({
  events: propEvents = [],
  onEventsChange,
  readOnly = false,
  ...props
}: AcademicCalendarProps) {
  // Use propEvents directly, fallback to dummyEvents if empty
  const events = propEvents.length === 0 ? dummyEvents : propEvents;

  const handleEventsChange = (updatedEvents: AcademicEvent[]) => {
    onEventsChange?.(updatedEvents);
  };

  return (
    <Calendar
      {...props}
      events={events}
      onEventUpdate={handleEventsChange}
      readOnly={readOnly}
      showLegend={true}
    />
  );
}
