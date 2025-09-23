import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "./pages/SubjectPage";
import LearningHub from "./pages/LearningHub";
import DailyQuestions from "./pages/DailyQuestions";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import { ProfilePage } from "./pages/ProfilePage";
import Progress from "./pages/Progress";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import StudentProfile from "./pages/student/StudentProfile";
import StudentProgress from "./pages/student/StudentProgress";
import Contests from "./pages/Contests";
import CreateContest from "./pages/CreateContest";
import ContestParticipation from "./pages/ContestParticipation";
import ContestResults from "./pages/ContestResults";
import NotFound from "./pages/NotFound";
import { EmailVerification } from "@/components/EmailVerification";
import PasswordResetPage from "./pages/PasswordResetPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { FirestoreProvider } from "@/contexts/FirestoreContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import QuizManagementPage from "./pages/QuizManagementPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import LessonPage from "./pages/LessonPage";
import QuizPage from "./pages/QuizPage";
import StudentDashboard from "./pages/StudentDashboard";
import RBACTestPage from "./pages/RBACTestPage";
import PageTransition from "@/components/PageTransition";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <ProfileProvider>
          <FirestoreProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <PageTransition>
                  <Index />
                </PageTransition>
              } />
              <Route path="/signin" element={
                <PageTransition>
                  <SignIn />
                </PageTransition>
              } />
              <Route path="/verify-email" element={
                <PageTransition>
                  <EmailVerification />
                </PageTransition>
              } />
              <Route path="/reset-password" element={
                <PageTransition>
                  <PasswordResetPage />
                </PageTransition>
              } />
              <Route path="/dashboard" element={
                <PageTransition>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/student/dashboard" element={
                <PageTransition>
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/teacher/dashboard" element={
                <PageTransition>
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/subject/:subject" element={
                <PageTransition>
                  <ProtectedRoute>
                    <SubjectPage />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/learning" element={
                <PageTransition>
                  <ProtectedRoute>
                    <LearningHub />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/daily-questions" element={
                <PageTransition>
                  <ProtectedRoute>
                    <DailyQuestions />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/subjects/:subjectId/quizzes" element={
                <PageTransition>
                  <ProtectedRoute>
                    <QuizManagementPage />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/teacher/dashboard" element={
                <PageTransition>
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/leaderboard" element={
                <PageTransition>
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/achievements" element={
                <PageTransition>
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/progress" element={
                <PageTransition>
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/profile" element={
                <PageTransition>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/teacher/profile" element={
                <PageTransition>
                  <ProtectedRoute>
                    <TeacherProfile />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/teacher/analytics" element={
                <PageTransition>
                  <ProtectedRoute>
                    <TeacherAnalytics />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/teacher/create-quiz" element={
                <PageTransition>
                  <ProtectedRoute>
                    <CreateQuiz />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/student/profile" element={
                <PageTransition>
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/student/progress" element={
                <PageTransition>
                  <ProtectedRoute>
                    <StudentProgress />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/contests" element={
                <PageTransition>
                  <ProtectedRoute>
                    <Contests />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/contests/create" element={
                <PageTransition>
                  <ProtectedRoute>
                    <CreateContest />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/contests/:id" element={
                <PageTransition>
                  <ProtectedRoute>
                    <ContestParticipation />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/contests/:id/results" element={
                <PageTransition>
                  <ProtectedRoute>
                    <ContestResults />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/subjects/:subjectId/lessons/:lessonId" element={
                <PageTransition>
                  <ProtectedRoute>
                    <LessonPage />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/subjects/:subjectId/quizzes/:quizId" element={
                <PageTransition>
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                </PageTransition>
              } />
              <Route path="/rbac-test" element={
                <PageTransition>
                  <ProtectedRoute>
                    <RBACTestPage />
                  </ProtectedRoute>
                </PageTransition>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FirestoreProvider>
    </ProfileProvider>
    </AuthProvider>
  </LanguageProvider>
  </QueryClientProvider>
);

export default App;
