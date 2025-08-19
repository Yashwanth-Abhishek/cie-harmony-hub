import React, { useState, useRef, useEffect, TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import { cn } from "@/lib/utils";

interface PastEvent {
  id: string;
  title: string;
  description: string;
  spotlightColor: string;
}

interface PastEventsCarouselProps {
  events: PastEvent[];
  className?: string;
}

export default function PastEventsCarousel({ events, className = "" }: PastEventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = Math.ceil(events.length / 2);
  const maxIndex = Math.max(0, totalSlides - 1);

  // Handle mouse/touch events for drag scrolling
  const startDrag = (e: React.MouseEvent | TouchEvent) => {
    if (!scrollContainerRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    setIsDragging(true);
    setStartX(clientX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const onDrag = (e: React.MouseEvent | TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll multiplier for better UX
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    setIsDragging(false);
    
    // Reset styles
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    // Update current index after drag ends
    updateCurrentIndex();
  };

  const scrollToIndex = (index: number) => {
    if (isScrolling || !scrollContainerRef.current) return;
    
    setIsScrolling(true);
    setCurrentIndex(index);
    
    const container = scrollContainerRef.current;
    const scrollAmount = index * (container.scrollWidth / totalSlides);
    
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });

    // Reset scrolling flag after animation
    setTimeout(() => setIsScrolling(false), 500);
  };

  const updateCurrentIndex = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    
    // Calculate current index based on scroll position
    const newIndex = Math.round((scrollLeft / (scrollWidth - containerWidth)) * maxIndex);
    if (newIndex !== currentIndex && !isScrolling) {
      setCurrentIndex(newIndex);
    }
  };

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  // Handle scroll events with debounce
  const handleScroll = () => {
    if (!isDragging) {
      updateCurrentIndex();
    }
  };

  // Add event listeners for drag and touch events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => startDrag(e);
    const handleTouchMove = (e: TouchEvent) => onDrag(e);
    const handleTouchEnd = () => endDrag();

    container.addEventListener('touchstart', handleTouchStart as any, { passive: false });
    container.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart as any);
      container.removeEventListener('touchmove', handleTouchMove as any);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isDragging, startX, scrollLeft, currentIndex]);

  if (events.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        No past events available
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0 || isScrolling}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white border-0 shadow-md rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button
        onClick={nextSlide}
        disabled={currentIndex === maxIndex || isScrolling}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/80 hover:bg-white border-0 shadow-md rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 transition-transform duration-500 ease-out">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="flex-shrink-0 w-full max-w-sm"
              style={{ width: 'calc(50% - 0.75rem)' }}
            >
              <SpotlightCard 
                className="custom-spotlight-card h-full" 
                spotlightColor={event.spotlightColor}
              >
                <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm">{event.description}</p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              disabled={isScrolling}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
