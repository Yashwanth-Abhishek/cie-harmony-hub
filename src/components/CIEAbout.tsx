import { useState, useEffect } from "react";
import PastEventsCarousel from "./PastEventsCarousel";

interface CIEAboutProps {
  className?: string;
}

const pastEvents = [
  {
    id: "1",
    title: "Innovation Workshop 2023",
    description: "Regular workshops on design thinking, lean startup methodology, and innovation frameworks to nurture creative problem-solving skills.",
    spotlightColor: "rgba(0, 229, 255, 0.2)"
  },
  {
    id: "2",
    title: "Startup Pitch Day",
    description: "Comprehensive support for early-stage startups including funding guidance, legal support, and market validation assistance.",
    spotlightColor: "rgba(255, 100, 150, 0.2)"
  },
  {
    id: "3",
    title: "Mentor Connect Session",
    description: "8-week structured mentoring programs connecting students with industry experts for personalized guidance and career development.",
    spotlightColor: "rgba(100, 255, 150, 0.2)"
  },
  {
    id: "4",
    title: "Product Demo Day",
    description: "Intensive programs helping teams transform ideas into market-ready products through systematic development processes.",
    spotlightColor: "rgba(255, 200, 100, 0.2)"
  },
  {
    id: "5",
    title: "Industry Partnership Event",
    description: "Collaborative projects with leading companies providing real-world experience and networking opportunities for students.",
    spotlightColor: "rgba(200, 100, 255, 0.2)"
  }
];

export default function CIEAbout({ className }: CIEAboutProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Past Events & Activities */}
      <div className="card-soft p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Past Events & Activities
        </h2>
        
        <PastEventsCarousel events={pastEvents} />
      </div>
    </div>
  );
}