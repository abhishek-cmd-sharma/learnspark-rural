import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import {
  Home,
  BookOpen,
  Calendar,
  Trophy,
  BarChart3,
  Award,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";

export function Header() {
  const location = useLocation();
  const { currentUser, userData, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [classValue, setClassValue] = useState("8");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };
  
  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: Home },
    { id: "learning", label: "Learning Hub", path: "/learning", icon: BookOpen },
    { id: "daily-questions", label: "Daily Questions", path: "/daily-questions", icon: Calendar },
    { id: "contests", label: "Contests", path: "/contests", icon: Trophy },
    { id: "progress", label: "Progress", path: "/progress", icon: BarChart3 },
    { id: "achievements", label: "Achievements", path: "/achievements", icon: Award },
  ];
  
  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Logo & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">EduQuest</h1>
              <p className="text-xs opacity-90">Rural Learning Platform</p>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          
          {/* User Info & Controls - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Class Selector */}
            <select
              value={classValue}
              onChange={(e) => setClassValue(e.target.value)}
              className="bg-white/20 text-white rounded-lg px-2 py-1 text-sm border border-white/30"
            >
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-white/20 text-white rounded-lg px-2 py-1 text-sm border border-white/30"
            >
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="bn">🇧🇩 বাংলা</option>
              <option value="te">🇮🇳 తెలుగు</option>
              <option value="ta">🇮🇳 தமிழ்</option>
              <option value="mr">🇮🇳 मराठी</option>
            </select>
            
            {/* XP & Level */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold">
                <span className="text-sm">{userData?.level || "1"}</span>
              </div>
              <div className="hidden lg:block">
                <div className="text-xs opacity-90">Level {userData?.level || "1"} Scholar</div>
                <div className="flex items-center space-x-1">
                  <div className="w-16 h-1.5 bg-white/20 rounded-full">
                    <div
                      className="h-1.5 rounded-full bg-white"
                      style={{ width: `${userData?.xp ? (userData.xp % 1000) / 10 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{userData?.xp || "0"}/1000 XP</span>
                </div>
              </div>
            </div>
            
            {/* Profile & Logout Buttons */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button
                    variant="outline"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/signin">
                <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Controls & Navigation */}
        <div className={`mt-4 ${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          {/* Mobile Controls */}
          <div className="flex flex-col space-y-3 mb-4 p-3 bg-white/10 rounded-lg">
            {/* Class Selector - Mobile */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Class:</label>
              <select
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                className="bg-white/20 text-white rounded-lg px-3 py-1 text-sm border border-white/30"
              >
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            {/* Language Selector - Mobile */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-white/20 text-white rounded-lg px-3 py-1 text-sm border border-white/30"
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="bn">🇧🇩 বাংলা</option>
                <option value="te">🇮🇳 తెలుగు</option>
                <option value="ta">🇮🇳 தமிழ்</option>
                <option value="mr">🇮🇳 मराठी</option>
              </select>
            </div>

            {/* Mobile Profile & Logout */}
            {currentUser && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-white/20">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Navigation - responsive for mobile */}
          <nav>
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm ${
                      location.pathname === item.path
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
