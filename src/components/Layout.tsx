import { useState, useEffect } from "react";
import { Menu, X, Calendar, GraduationCap, Users, Lightbulb, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Add smooth scrolling behavior
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const navigationItems = [
  { id: "home", label: "Dashboard", icon: Calendar, href: "/" },
  { id: "academic", label: "Academic Calendar", icon: GraduationCap, href: "/academic" },
  { id: "mentoring", label: "Mentoring", icon: Users, href: "/mentoring" },
  { id: "events", label: "Event Planning", icon: Plus, href: "/events" },
  { id: "cohorts", label: "Development Cohorts", icon: Lightbulb, href: "/cohorts" },
  { id: "studios", label: "CIE Studios", icon: Camera, href: "/studios" },
];

export default function Layout({ children, currentPage = "home" }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border/50 px-4 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/efac296d-8c26-405c-bbf9-fedc89cad811.png" 
              alt="MLR CIE Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-semibold text-foreground">CIE Calendar</h1>
              <p className="text-xs text-muted-foreground">Centre of Innovation and Entrepreneurship</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="btn-pastel">
            Today
          </Button>
        </div>
      </header>

      {/* Main Content and Sidebar Container */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={cn(
            "bg-card border-r border-border/50 transition-all duration-300 z-20",
            "fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)]",
            isMobile 
              ? `${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
              : `${sidebarOpen ? 'w-64' : 'w-20'}`,
          )}
        >
          <nav className="p-4 space-y-2 h-full overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground/80",
                    "text-sm font-medium"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity whitespace-nowrap",
                    !sidebarOpen && !isMobile ? "opacity-0 w-0" : "opacity-100"
                  )}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)]",
          isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"
        )}>
          <div className="p-4 md:p-6 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}