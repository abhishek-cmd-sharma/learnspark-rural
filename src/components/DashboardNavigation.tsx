import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Star, 
  User, 
  BarChart3, 
  Calendar, 
  Users, 
  Plus,
  Award,
  Settings,
  Home,
  Zap,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardNavigation = () => {
  // Navigation items with labels, paths, icons, and colors
  const navItems = [
    {
      label: "Home",
      path: "/dashboard",
      icon: <Home className="w-8 h-8" />,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      label: "Learning Hub",
      path: "/learning",
      icon: <BookOpen className="w-8 h-8" />,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      label: "Daily Questions",
      path: "/daily-questions",
      icon: <Target className="w-8 h-8" />,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      label: "Contests",
      path: "/contests",
      icon: <Trophy className="w-8 h-8" />,
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600"
    },
    {
      label: "Leaderboard",
      path: "/leaderboard",
      icon: <Award className="w-8 h-8" />,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600"
    },
    {
      label: "Achievements",
      path: "/achievements",
      icon: <Star className="w-8 h-8" />,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600"
    },
    {
      label: "Progress",
      path: "/progress",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600"
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <User className="w-8 h-8" />,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600"
    },
    {
      label: "Create Contest",
      path: "/contests/create",
      icon: <Plus className="w-8 h-8" />,
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600"
    },
    {
      label: "Quiz Management",
      path: "/subjects/mathematics/quizzes",
      icon: <Settings className="w-8 h-8" />,
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Learning Dashboard</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Explore all available learning resources and track your progress
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            className="group"
          >
            <Link to={item.path} className="block h-full">
              <motion.div 
                className={`${item.color} rounded-2xl shadow-lg p-5 md:p-6 text-white transition-all duration-300 ${item.hoverColor} group-hover:shadow-xl h-full flex flex-col items-center justify-center border-2 border-transparent group-hover:border-white group-focus:border-white relative overflow-hidden`}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                layout
                transition={{ 
                  layout: { duration: 0.3 },
                  boxShadow: { duration: 0.2 }
                }}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="mb-3 md:mb-4 z-10"
                >
                  {item.icon}
                </motion.div>
                
                <h3 className="text-lg md:text-xl font-bold text-center z-10 mb-2">{item.label}</h3>
                
                <motion.div
                  className="mt-2 md:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-30 transform translate-y-2 group-hover:translate-y-0"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Explore
                  </Button>
                </motion.div>
                
                {/* Selection indicator */}
                <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardNavigation;