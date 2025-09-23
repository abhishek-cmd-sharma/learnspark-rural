import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  School, 
  MapPin, 
  Calendar, 
  Languages, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  BookOpen,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface StudentOnboardingProps {
  isVisible: boolean;
  onComplete: (data: StudentOnboardingData) => void;
  onSkip: () => void;
}

export interface StudentOnboardingData {
  age: number;
  gradeLevel: string;
  school: string;
  location: string;
  nativeLanguage: string;
  targetLanguages: string[];
  learningGoals: string[];
  class: string;
  preferredLanguage: string;
}

const GRADE_LEVELS = [
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
  '11th Grade', '12th Grade', 'College', 'Graduate'
];

const CLASSES = [
  'Class A', 'Class B', 'Class C', 'Class D', 'Class E',
  'Morning Batch', 'Evening Batch', 'Weekend Batch',
  'Advanced Class', 'Beginner Class', 'Intermediate Class'
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' }
];

const LEARNING_GOALS = [
  'Improve academic performance',
  'Prepare for exams',
  'Learn new languages',
  'Develop problem-solving skills',
  'Enhance creativity',
  'Build confidence',
  'Career preparation',
  'Personal interest'
];

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StudentOnboardingData>({
    age: 0,
    gradeLevel: '',
    school: '',
    location: '',
    nativeLanguage: '',
    targetLanguages: [],
    learningGoals: [],
    class: '',
    preferredLanguage: 'en'
  });

  const { userData } = useAuth();
  const { setLanguage } = useLanguage();

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: <User className="w-6 h-6" />
    },
    {
      title: 'Academic Details',
      description: 'Your school and grade information',
      icon: <School className="w-6 h-6" />
    },
    {
      title: 'Class Selection',
      description: 'Choose your class',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Language Preferences',
      description: 'Select your languages',
      icon: <Languages className="w-6 h-6" />
    },
    {
      title: 'Learning Goals',
      description: 'What do you want to achieve?',
      icon: <Target className="w-6 h-6" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Validate required fields
    if (!formData.age || !formData.gradeLevel || !formData.class) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Set the preferred language
    setLanguage(formData.preferredLanguage as any);
    
    onComplete(formData);
  };

  const updateFormData = (field: keyof StudentOnboardingData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-purple-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Welcome to EduQuest!
                  </CardTitle>
                  <p className="text-purple-100 mt-1">
                    Let's set up your learning profile
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-white hover:bg-white/20"
                >
                  Skip for now
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-purple-100 mb-2">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-white rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                      {steps[currentStep].icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
                      <p className="text-gray-600">{steps[currentStep].description}</p>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-4">
                    {currentStep === 0 && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="age">Age *</Label>
                            <Input
                              id="age"
                              type="number"
                              min="5"
                              max="100"
                              value={formData.age || ''}
                              onChange={(e) => updateFormData('age', parseInt(e.target.value) || 0)}
                              placeholder="Enter your age"
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => updateFormData('location', e.target.value)}
                                placeholder="City, State"
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 1 && (
                      <>
                        <div>
                          <Label htmlFor="gradeLevel">Grade Level *</Label>
                          <Select
                            value={formData.gradeLevel}
                            onValueChange={(value) => updateFormData('gradeLevel', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your grade level" />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADE_LEVELS.map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="school">School Name</Label>
                          <div className="relative">
                            <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="school"
                              value={formData.school}
                              onChange={(e) => updateFormData('school', e.target.value)}
                              placeholder="Enter your school name"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 2 && (
                      <>
                        <div>
                          <Label htmlFor="class">Select Your Class *</Label>
                          <p className="text-sm text-gray-600 mb-3">
                            Choose the class you want to join for your learning journey
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {CLASSES.map((className) => (
                              <motion.button
                                key={className}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateFormData('class', className)}
                                className={`p-3 rounded-lg border-2 text-left transition-all ${
                                  formData.class === className
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span className="font-medium">{className}</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 3 && (
                      <>
                        <div>
                          <Label>App Language</Label>
                          <p className="text-sm text-gray-600 mb-3">
                            Choose your preferred language for the app interface
                          </p>
                          <Select
                            value={formData.preferredLanguage}
                            onValueChange={(value) => updateFormData('preferredLanguage', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select app language" />
                            </SelectTrigger>
                            <SelectContent>
                              {LANGUAGES.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  <span className="flex items-center gap-2">
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Native Language</Label>
                          <Select
                            value={formData.nativeLanguage}
                            onValueChange={(value) => updateFormData('nativeLanguage', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your native language" />
                            </SelectTrigger>
                            <SelectContent>
                              {LANGUAGES.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  <span className="flex items-center gap-2">
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Languages You Want to Learn</Label>
                          <p className="text-sm text-gray-600 mb-3">
                            Select multiple languages (optional)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                              <Badge
                                key={lang.code}
                                variant={formData.targetLanguages.includes(lang.code) ? "default" : "outline"}
                                className="cursor-pointer hover:bg-purple-100"
                                onClick={() => updateFormData('targetLanguages', 
                                  toggleArrayItem(formData.targetLanguages, lang.code)
                                )}
                              >
                                <span className="mr-1">{lang.flag}</span>
                                {lang.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {currentStep === 4 && (
                      <>
                        <div>
                          <Label>Learning Goals</Label>
                          <p className="text-sm text-gray-600 mb-3">
                            What do you want to achieve? (Select multiple)
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {LEARNING_GOALS.map((goal) => (
                              <motion.button
                                key={goal}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateFormData('learningGoals', 
                                  toggleArrayItem(formData.learningGoals, goal)
                                )}
                                className={`p-3 rounded-lg border-2 text-left transition-all ${
                                  formData.learningGoals.includes(goal)
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  <span>{goal}</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Complete Setup
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};