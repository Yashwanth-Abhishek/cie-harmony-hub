export type EventType = 'Exams' | 'Events' | 'Holidays' | 'Instruction Days';

export interface AcademicEvent {
  id: string;
  date: string;
  category: EventType;
  name: string;
  description: string;
  color?: string;
  type: 'exam' | 'event' | 'holiday' | 'instruction';
  year: number;
}

export const dummyEvents: AcademicEvent[] = [
  // August 2025
  { 
    id: 'event-1',
    date: "2025-08-05", 
    category: "Events", 
    name: "Tech Workshop", 
    description: "Hands-on workshop on IoT basics.",
    type: 'event',
    color: '#AECBFA',
    year: 1
  },
  { 
    id: 'event-2',
    date: "2025-08-15", 
    category: "Holidays", 
    name: "Independence Day", 
    description: "National holiday - College closed.",
    type: 'holiday',
    color: '#FFF475',
    year: 1
  },
  { 
    id: 'event-3',
    date: "2025-08-20", 
    category: "Exams", 
    name: "Mid-term Exams", 
    description: "Mid-term examinations for all courses.",
    type: 'exam',
    color: '#F28B82',
    year: 1
  },
  { 
    id: 'event-4',
    date: "2025-08-25", 
    category: "Holidays", 
    name: "Raksha Bandhan", 
    description: "Festival holiday - College closed.",
    type: 'holiday',
    color: '#FFF475',
    year: 1
  },
  { 
    id: 'event-5',
    date: "2025-08-30", 
    category: "Instruction Days", 
    name: "Project Submissions", 
    description: "Deadline for project submissions.",
    type: 'instruction',
    color: '#CCFF90',
    year: 1
  },
  // September 2025
  { 
    id: 'event-6',
    date: "2025-09-05", 
    category: "Events", 
    name: "Career Fair", 
    description: "Annual career fair with top companies.",
    type: 'event',
    color: '#AECBFA',
    year: 1
  },
  { 
    id: 'event-7',
    date: "2025-09-10", 
    category: "Instruction Days", 
    name: "Guest Lecture", 
    description: "Special lecture on AI in modern applications.",
    type: 'instruction',
    color: '#CCFF90',
    year: 1
  },
  { 
    id: 'event-8',
    date: "2025-09-15", 
    category: "Events", 
    name: "Hackathon", 
    description: "24-hour coding competition for all students.",
    type: 'event',
    color: '#AECBFA',
    year: 1
  },
  { 
    id: 'event-9',
    date: "2025-09-20", 
    category: "Exams", 
    name: "Quiz 1", 
    description: "First quiz for all courses.",
    type: 'exam',
    color: '#F28B82',
    year: 1
  },
  { 
    id: 'event-10',
    date: "2025-09-25", 
    category: "Holidays", 
    name: "Gandhi Jayanti", 
    description: "National holiday - College closed.",
    type: 'holiday',
    color: '#FFF475',
    year: 1
  },
  // October 2025
  { 
    id: 'event-11',
    date: "2025-10-02", 
    category: "Events", 
    name: "Cultural Fest", 
    description: "Annual cultural festival begins.",
    type: 'event',
    color: '#AECBFA',
    year: 1
  },
  { 
    id: 'event-12',
    date: "2025-10-12", 
    category: "Holidays", 
    name: "Dussehra", 
    description: "Festival holiday - College closed.",
    type: 'holiday',
    color: '#FFF475',
    year: 1
  },
  { 
    id: 'event-13',
    date: "2025-10-20", 
    category: "Events", 
    name: "Alumni Meet", 
    description: "Annual alumni gathering and networking event.",
    type: 'event',
    color: '#AECBFA',
    year: 1
  },
  { 
    id: 'event-14',
    date: "2025-10-25", 
    category: "Exams", 
    name: "Mid-term Exams", 
    description: "Second mid-term examinations.",
    type: 'exam',
    color: '#F28B82',
    year: 1
  },
  { 
    id: 'event-15',
    date: "2025-10-30", 
    category: "Instruction Days", 
    name: "Workshop", 
    description: "Workshop on cloud computing and deployment.",
    type: 'instruction',
    color: '#CCFF90',
    year: 1
  },
  { 
    id: 'event-16',
    date: "2025-10-31", 
    category: "Events", 
    name: "Halloween Party", 
    description: "Annual Halloween celebration.",
    type: 'event',
    color: '#AECBFA',
    year: 1
  }
];

export const getEventColor = (category: string): string => {
  switch(category) {
    case 'Exams': return '#F28B82';
    case 'Events': return '#AECBFA';
    case 'Holidays': return '#FFF475';
    case 'Instruction Days': return '#CCFF90';
    default: return '#E0E0E0';
  }
};

export const getEventType = (category: string): 'exam' | 'event' | 'holiday' | 'instruction' => {
  switch(category) {
    case 'Exams': return 'exam';
    case 'Events': return 'event';
    case 'Holidays': return 'holiday';
    case 'Instruction Days':
    default: return 'instruction';
  }
};
