import { Button } from "@/components/ui/button";
import { Rocket, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  
  return (
    <header className="cosmic-card border-b-2 border-white/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary float-animation" />
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduQuest
            </h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#subjects" className="text-foreground hover:text-primary transition-colors font-medium">
            Subjects
          </a>
          <a href="#leaderboard" className="text-foreground hover:text-primary transition-colors font-medium">
            Leaderboard
          </a>
          <a href="#achievements" className="text-foreground hover:text-primary transition-colors font-medium">
            Achievements
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isDashboard ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="hidden md:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="outline" size="icon" className="md:hidden">
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="hidden md:flex">
                  Dashboard
                </Button>
              </Link>
              <Button variant="cosmic" className="hidden md:flex">
                Sign In
              </Button>
              <Button variant="outline" size="icon" className="md:hidden">
                <User className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}