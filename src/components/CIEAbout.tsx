import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CIEAboutProps {
  className?: string;
}

const cieActivities = [
  {
    title: "Innovation Workshops",
    description: "Regular workshops on design thinking, lean startup methodology, and innovation frameworks to nurture creative problem-solving skills."
  },
  {
    title: "Mentorship Programs",
    description: "8-week structured mentoring programs connecting students with industry experts for personalized guidance and career development."
  },
  {
    title: "Product Development Cohorts",
    description: "Intensive programs helping teams transform ideas into market-ready products through systematic development processes."
  },
  {
    title: "Startup Incubation",
    description: "Comprehensive support for early-stage startups including funding guidance, legal support, and market validation assistance."
  },
  {
    title: "Industry Partnerships",
    description: "Collaborative projects with leading companies providing real-world experience and networking opportunities for students."
  }
];

// Placeholder for past event images - in a real app, these would be actual images
const pastEventImages = [
  { id: 1, alt: "Innovation Workshop 2023", color: "from-pastel-blue to-pastel-lavender" },
  { id: 2, alt: "Startup Pitch Day", color: "from-pastel-green to-pastel-blue" },
  { id: 3, alt: "Mentor Connect Session", color: "from-pastel-pink to-pastel-peach" },
  { id: 4, alt: "Product Demo Day", color: "from-pastel-yellow to-pastel-green" },
  { id: 5, alt: "Industry Partnership Event", color: "from-pastel-lavender to-pastel-pink" }
];

export default function CIEAbout({ className }: CIEAboutProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % pastEventImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % pastEventImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + pastEventImages.length) % pastEventImages.length);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* What CIE Does Section */}
      <Card className="card-soft">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            What CIE Does?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cieActivities.map((activity, index) => (
              <div 
                key={index} 
                className="p-4 bg-gradient-to-br from-background to-muted/30 rounded-lg border border-border/30 hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-semibold text-foreground mb-2">{activity.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Events Image Slider */}
      <Card className="card-soft">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Past Events & Activities
          </h2>
          
          <div className="relative">
            {/* Image Container */}
            <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br border border-border/30">
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${pastEventImages[currentImageIndex].color} flex items-center justify-center transition-all duration-500`}
              >
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📸</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">
                    {pastEventImages[currentImageIndex].alt}
                  </h3>
                  <p className="text-white/70 text-sm">
                    Inspiring moments from our community
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-0 shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-0 shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {pastEventImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-primary w-6' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}