import { useState } from "react";
import { Menu, X, Calendar, GraduationCap, Users, Lightbulb, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-card border-b border-border/50 px-4 flex items-center justify-between shadow-sm">
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

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border/50 transition-all duration-300 z-10",
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          )}
        >
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "sidebar-item",
                    isActive && "active"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            sidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}