import { subjectService, achievementService, contestService, quizService } from "./firestoreService";
import { Subject, Achievement, Contest, Quiz, Question } from "./types";

// Sample subjects data
const sampleSubjects: Omit<Subject, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Mathematics",
    description: "Learn fundamental math concepts including arithmetic, algebra, and geometry.",
    icon: "Calculator",
    color: "subject-math",
    level: 1,
    progress: 0,
    totalLessons: 24,
    completedLessons: 0
  },
  {
    name: "English",
    description: "Improve your reading, writing, and grammar skills.",
    icon: "BookOpen",
    color: "subject-english",
    level: 1,
    progress: 0,
    totalLessons: 20,
    completedLessons: 0
  },
  {
    name: "Science",
    description: "Explore the wonders of science including physics, chemistry, and biology.",
    icon: "Microscope",
    color: "subject-science",
    level: 1,
    progress: 0,
    totalLessons: 18,
    completedLessons: 0
  },
  {
    name: "History",
    description: "Discover the fascinating events and people that shaped our world.",
    icon: "Scroll",
    color: "subject-history",
    level: 1,
    progress: 0,
    totalLessons: 15,
    completedLessons: 0
  },
  {
    name: "Geography",
    description: "Learn about the world's countries, cultures, and natural features.",
    icon: "Globe",
    color: "subject-geography",
    level: 1,
    progress: 0,
    totalLessons: 12,
    completedLessons: 0
  },
  {
    name: "General Knowledge",
    description: "Test your knowledge across a wide range of topics.",
    icon: "Brain",
    color: "subject-general",
    level: 1,
    progress: 0,
    totalLessons: 30,
    completedLessons: 0
  }
];

// Sample quizzes data
const sampleQuizzes: Omit<Quiz, "id" | "createdAt" | "updatedAt">[] = [
 {
    subjectId: "", // Will be updated with actual subject ID
    title: "Basic Arithmetic",
    description: "Test your knowledge of basic arithmetic operations",
    difficulty: "easy",
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: "q1",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is 5 + 7?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "5 + 7 = 12",
        points: 10
      },
      {
        id: "q2",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is 15 - 8?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "15 - 8 = 7",
        points: 10
      },
      {
        id: "q3",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is 4 × 6?",
        options: ["20", "22", "24", "26"],
        correctAnswer: 2,
        explanation: "4 × 6 = 24",
        points: 10
      },
      {
        id: "q4",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is 18 ÷ 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 2,
        explanation: "18 ÷ 3 = 6",
        points: 10
      },
      {
        id: "q5",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is 9 + 6 - 3?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "9 + 6 - 3 = 12",
        points: 10
      }
    ]
  },
 {
    subjectId: "", // Will be updated with actual subject ID
    title: "English Grammar Basics",
    description: "Test your knowledge of basic English grammar",
    difficulty: "easy",
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: "q1",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which word is a noun?",
        options: ["run", "quickly", "dog", "beautiful"],
        correctAnswer: 2,
        explanation: "A noun is a person, place, thing, or idea. 'Dog' is a thing.",
        points: 10
      },
      {
        id: "q2",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which sentence is correct?",
        options: [
          "She don't like apples.",
          "She doesn't likes apples.",
          "She doesn't like apples.",
          "She not like apples."
        ],
        correctAnswer: 2,
        explanation: "The correct form is 'She doesn't like apples.'",
        points: 10
      },
      {
        id: "q3",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the past tense of 'go'?",
        options: ["goed", "went", "goes", "going"],
        correctAnswer: 1,
        explanation: "The past tense of 'go' is 'went'.",
        points: 10
      },
      {
        id: "q4",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which word is an adjective?",
        options: ["run", "quickly", "happy", "jump"],
        correctAnswer: 2,
        explanation: "An adjective describes a noun. 'Happy' describes how someone feels.",
        points: 10
      },
      {
        id: "q5",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the plural of 'child'?",
        options: ["childs", "children", "childes", "childies"],
        correctAnswer: 1,
        explanation: "The plural of 'child' is 'children'.",
        points: 10
      }
    ]
  },
  {
    subjectId: "", // Will be updated with actual subject ID
    title: "Basic Science Concepts",
    description: "Test your knowledge of basic science concepts",
    difficulty: "easy",
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: "q1",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: 0,
        explanation: "The chemical symbol for water is H2O.",
        points: 10
      },
      {
        id: "q2",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars is known as the Red Planet due to iron oxide on its surface.",
        points: 10
      },
      {
        id: "q3",
        quizId: "", // Will be updated with actual quiz ID
        text: "What force keeps us on the ground?",
        options: ["Magnetism", "Friction", "Gravity", "Inertia"],
        correctAnswer: 2,
        explanation: "Gravity is the force that pulls objects toward each other.",
        points: 10
      },
      {
        id: "q4",
        quizId: "", // Will be updated with actual quiz ID
        text: "What gas do plants need for photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswer: 2,
        explanation: "Plants use carbon dioxide from the air for photosynthesis.",
        points: 10
      },
      {
        id: "q5",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the boiling point of water?",
        options: ["50°C", "100°C", "150°C", "200°C"],
        correctAnswer: 1,
        explanation: "Water boils at 100°C (212°F) at sea level.",
        points: 10
      }
    ]
  },
  {
    subjectId: "", // Will be updated with actual subject ID
    title: "World History Overview",
    description: "Test your knowledge of world history",
    difficulty: "easy",
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: "q1",
        quizId: "", // Will be updated with actual quiz ID
        text: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: 1,
        explanation: "World War II ended in 1945.",
        points: 10
      },
      {
        id: "q2",
        quizId: "", // Will be updated with actual quiz ID
        text: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
        correctAnswer: 2,
        explanation: "George Washington was the first President of the United States.",
        points: 10
      },
      {
        id: "q3",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which ancient civilization built the pyramids?",
        options: ["Romans", "Greeks", "Egyptians", "Mesopotamians"],
        correctAnswer: 2,
        explanation: "The ancient Egyptians built the pyramids.",
        points: 10
      },
      {
        id: "q4",
        quizId: "", // Will be updated with actual quiz ID
        text: "In which year did India gain independence?",
        options: ["1945", "1947", "1949", "1951"],
        correctAnswer: 1,
        explanation: "India gained independence from British rule in 1947.",
        points: 10
      },
      {
        id: "q5",
        quizId: "", // Will be updated with actual quiz ID
        text: "Who discovered America in 1492?",
        options: ["Marco Polo", "Vasco da Gama", "Christopher Columbus", "Amerigo Vespucci"],
        correctAnswer: 2,
        explanation: "Christopher Columbus is credited with discovering America in 1492.",
        points: 10
      }
    ]
  },
  {
    subjectId: "", // Will be updated with actual subject ID
    title: "Geography Basics",
    description: "Test your knowledge of world geography",
    difficulty: "easy",
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: "q1",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Rome"],
        correctAnswer: 2,
        explanation: "The capital of France is Paris.",
        points: 10
      },
      {
        id: "q2",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which is the largest ocean?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: 3,
        explanation: "The Pacific Ocean is the largest ocean in the world.",
        points: 10
      },
      {
        id: "q3",
        quizId: "", // Will be updated with actual quiz ID
        text: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Australia, and South America.",
        points: 10
      },
      {
        id: "q4",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correctAnswer: 1,
        explanation: "The Nile River is the longest river in the world.",
        points: 10
      },
      {
        id: "q5",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "South Korea", "Japan", "Thailand"],
        correctAnswer: 2,
        explanation: "Japan is known as the Land of the Rising Sun.",
        points: 10
      }
    ]
  },
  {
    subjectId: "", // Will be updated with actual subject ID
    title: "General Knowledge Challenge",
    description: "Test your general knowledge across various topics",
    difficulty: "medium",
    timeLimit: 420, // 7 minutes
    questions: [
      {
        id: "q1",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation: "The square root of 144 is 12 (12 × 12 = 144).",
        points: 10
      },
      {
        id: "q2",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        correctAnswer: 1,
        explanation: "Oxygen has the chemical symbol 'O'.",
        points: 10
      },
      {
        id: "q3",
        quizId: "", // Will be updated with actual quiz ID
        text: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2,
        explanation: "Leonardo da Vinci painted the Mona Lisa.",
        points: 10
      },
      {
        id: "q4",
        quizId: "", // Will be updated with actual quiz ID
        text: "What is the currency of Japan?",
        options: ["Yuan", "Won", "Yen", "Ringgit"],
        correctAnswer: 2,
        explanation: "The currency of Japan is the Yen.",
        points: 10
      },
      {
        id: "q5",
        quizId: "", // Will be updated with actual quiz ID
        text: "Which is the smallest country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correctAnswer: 1,
        explanation: "Vatican City is the smallest country in the world.",
        points: 10
      }
    ]
  }
];

// Sample contests data
const sampleContests: Omit<Contest, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Math Speed Challenge",
    description: "Test your math skills in this fast-paced challenge",
    startDate: new Date(Date.now() + 24 * 60 * 1000), // Tomorrow
    endDate: new Date(Date.now() + 25 * 60 * 1000), // Tomorrow + 1 hour
    subjectId: "", // Will be updated with actual subject ID
    participants: [],
    prize: "100 XP + Bronze Badge",
    difficulty: "Medium",
    duration: 15,
    questionsCount: 10
  },
  {
    title: "Science Brain Busters",
    description: "Put your science knowledge to the test",
    startDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // In 2 days
    endDate: new Date(Date.now() + 49 * 60 * 60 * 1000), // In 2 days + 1 hour
    subjectId: "", // Will be updated with actual subject ID
    participants: [],
    prize: "150 XP + Silver Badge",
    difficulty: "Hard",
    duration: 20,
    questionsCount: 15
  }
];

// Sample achievements data
const sampleAchievements: Omit<Achievement, "id" | "createdAt">[] = [
  {
    title: "First Quiz",
    description: "Complete your first quiz",
    icon: "🎯",
    rarity: "bronze",
    criteria: {
      type: "quiz_completion",
      value: 1
    }
  },
  {
    title: "Quiz Master",
    description: "Complete 10 quizzes",
    icon: "🎓",
    rarity: "silver",
    criteria: {
      type: "quiz_completion",
      value: 10
    }
  },
  {
    title: "Streak Builder",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    rarity: "silver",
    criteria: {
      type: "streak",
      value: 7
    }
  },
  {
    title: "Perfect Score",
    description: "Achieve a perfect score on any quiz",
    icon: "⭐",
    rarity: "gold",
    criteria: {
      type: "perfect_score",
      value: 1
    }
  },
  {
    title: "Dedicated Learner",
    description: "Complete 25 quizzes",
    icon: "🏆",
    rarity: "gold",
    criteria: {
      type: "quiz_completion",
      value: 25
    }
  },
  {
    title: "Legend",
    description: "Achieve 5 perfect scores",
    icon: "👑",
    rarity: "platinum",
    criteria: {
      type: "perfect_score",
      value: 5
    }
  }
];

// Initialize Firestore with sample data
export const initFirestoreData = async () => {
  try {
    console.log("Initializing Firestore data...");
    
    // Create subjects
    console.log("Creating subjects...");
    const subjectIds: string[] = [];
    for (const subject of sampleSubjects) {
      const id = await subjectService.createSubject(subject);
      subjectIds.push(id);
      console.log(`Created subject: ${subject.name} with ID: ${id}`);
    }
    
    // Update subject IDs in quizzes
    if (subjectIds.length >= 6) {
      sampleQuizzes[0].subjectId = subjectIds[0]; // Mathematics
      sampleQuizzes[1].subjectId = subjectIds[1]; // English
      sampleQuizzes[2].subjectId = subjectIds[2]; // Science
      sampleQuizzes[3].subjectId = subjectIds[3]; // History
      sampleQuizzes[4].subjectId = subjectIds[4]; // Geography
      sampleQuizzes[5].subjectId = subjectIds[5]; // General Knowledge
    }
    
    // Create quizzes
    console.log("Creating quizzes...");
    const quizIds: string[] = [];
    for (const quiz of sampleQuizzes) {
      const id = await quizService.createQuiz(quiz);
      quizIds.push(id);
      console.log(`Created quiz: ${quiz.title} with ID: ${id}`);
    }
    
    // Update quiz IDs in questions
    if (quizIds.length >= 6) {
      // Update questions for Mathematics quiz
      sampleQuizzes[0].questions.forEach(q => q.quizId = quizIds[0]);
      
      // Update questions for English quiz
      sampleQuizzes[1].questions.forEach(q => q.quizId = quizIds[1]);
      
      // Update questions for Science quiz
      sampleQuizzes[2].questions.forEach(q => q.quizId = quizIds[2]);
      
      // Update questions for History quiz
      sampleQuizzes[3].questions.forEach(q => q.quizId = quizIds[3]);
      
      // Update questions for Geography quiz
      sampleQuizzes[4].questions.forEach(q => q.quizId = quizIds[4]);
      
      // Update questions for General Knowledge quiz
      sampleQuizzes[5].questions.forEach(q => q.quizId = quizIds[5]);
      
      // Update quizzes with correct question IDs
      for (let i = 0; i < quizIds.length; i++) {
        await quizService.updateQuiz(quizIds[i], { questions: sampleQuizzes[i].questions });
      }
    }
    
    // Update Math Master achievement with actual subject ID
    if (subjectIds.length > 0) {
      sampleAchievements[2].criteria.subjectId = subjectIds[0]; // Math subject ID
    }
    
    // Create achievements
    console.log("Creating achievements...");
    for (const achievement of sampleAchievements) {
      const id = await achievementService.createAchievement(achievement);
      console.log(`Created achievement: ${achievement.title} with ID: ${id}`);
    }
    
    // Update contest subject IDs and create contests
    if (subjectIds.length > 0) {
      sampleContests[0].subjectId = subjectIds[0]; // Math subject ID
      sampleContests[1].subjectId = subjectIds[2]; // Science subject ID
      
      console.log("Creating contests...");
      for (const contest of sampleContests) {
        const id = await contestService.createContest(contest);
        console.log(`Created contest: ${contest.title} with ID: ${id}`);
      }
    }
    
    console.log("Firestore initialization complete!");
  } catch (error) {
    console.error("Error initializing Firestore data:", error);
  }
};