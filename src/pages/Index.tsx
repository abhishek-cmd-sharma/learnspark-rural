import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import {
  Rocket,
  Star,
  Trophy,
  BookOpen,
  Users,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  Play
} from "lucide-react";
import rocketHero from "@/assets/rocket-hero.jpg";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "6 Core Subjects",
      description: "Math, English, Science, History, Geography & General Knowledge"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and compete with friends"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Adaptive Difficulty",
      description: "Questions that adapt to your skill level for optimal learning"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Live Contests",
      description: "Compete in real-time quizzes with students worldwide"
    },
  ];

  const stats = [
    { number: "50K+", label: "Students Learning" },
    { number: "10K+", label: "Questions Answered Daily" },
    { number: "95%", label: "Improvement Rate" },
    { number: "6", label: "Subjects Available" },
  ];

  
    return (
      <PageTransition>
        <div className="min-h-screen cosmic-bg">
          <Header />
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 cosmic-card px-4 py-2 rounded-full"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Learning Made Fun!</span>
                </motion.div>
                
                <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    EduQuest
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Embark on an exciting educational journey designed specifically for rural students. 
                  Learn, compete, and achieve your dreams with our gamified learning platform! 🚀
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/learning">
                  <Button variant="cosmic" size="lg" className="text-lg px-8 py-6">
                    <Play className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>
                </Link>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Watch Demo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-primary font-display">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src={rocketHero} 
                  alt="Educational rocket journey"
                  className="w-full h-auto rounded-3xl cosmic-card float-animation"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl" />
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute top-10 right-10 cosmic-card p-3 bg-white/90 backdrop-blur-sm"
                >
                  <Star className="h-6 w-6 text-xp-primary" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-20 left-10 cosmic-card p-3 bg-white/90 backdrop-blur-sm"
                >
                  <Trophy className="h-6 w-6 text-level-gold" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Why Choose EduQuest?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've designed every feature to make learning engaging, effective, and fun for students aged 6-14.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="cosmic-card p-6 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 cosmic-card mb-4 text-primary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Ready to Start Your{" "}
              <span className="text-primary">Adventure?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their learning experience with EduQuest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learning">
                <Button variant="cosmic" size="lg" className="text-lg px-12 py-6">
                  <Rocket className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-12 py-6"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
    </PageTransition>
  );
};

export default Index;
