import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface SubjectCardProps {
  name: string;
  icon: React.ReactNode;
  progress: number;
  level: number;
  color: string;
  image: string;
  totalLessons: number;
  completedLessons: number;
}

export function SubjectCard({ 
  name, 
  icon, 
  progress, 
  level, 
  color, 
  image,
  totalLessons,
  completedLessons 
}: SubjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`cosmic-card overflow-hidden relative group cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image */}
      <div className="h-32 relative overflow-hidden">
        <img 
          src={image} 
          alt={`${name} illustration`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className={`absolute inset-0 ${color} mix-blend-multiply opacity-80`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Subject Icon */}
        <div className="absolute top-4 left-4 text-white text-2xl">
          {icon}
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-4 right-4 badge-shine bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Star className="h-3 w-3" />
          Level {level}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-lg">{name}</h3>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </div>
        </div>
        
        <Link to={`/subject/${name.toLowerCase().replace(/\s+/g, '-')}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Continue Learning
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}