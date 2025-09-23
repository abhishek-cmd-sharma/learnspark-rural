import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/lib/roleService";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function RBACTestPage() {
  const { userData } = useAuth();
  const { checkPermission, checkRole, checkAnyRole, userRole, hasUser } = usePermission();
  const navigate = useNavigate();

  // Test permissions
  const canManageQuizzes = checkPermission("manage", "quizzes");
  const canReadLessons = checkPermission("read", "lessons");
  const canCreateContests = checkPermission("create", "contests");
  
 // Test roles
  const isStudent = checkRole("student");
  const isTeacher = checkRole("teacher");
  const isAdmin = checkRole("admin");
  
  // Test any role
  const isTeacherOrAdmin = checkAnyRole(["teacher", "admin"]);

  return (
    <RoleProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">RBAC Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">User Information</h3>
              <p><strong>User ID:</strong> {userData?.uid || "Not available"}</p>
              <p><strong>Email:</strong> {userData?.email || "Not available"}</p>
              <p><strong>Display Name:</strong> {userData?.displayName || "Not available"}</p>
              <p><strong>Role:</strong> {userRole || "Not available"}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Permission Tests</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Can manage quizzes:</span>
                  <span className={`font-semibold ${canManageQuizzes ? 'text-green-600' : 'text-red-600'}`}>
                    {canManageQuizzes ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Can read lessons:</span>
                  <span className={`font-semibold ${canReadLessons ? 'text-green-600' : 'text-red-600'}`}>
                    {canReadLessons ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Can create contests:</span>
                  <span className={`font-semibold ${canCreateContests ? 'text-green-600' : 'text-red-600'}`}>
                    {canCreateContests ? 'Yes' : 'No'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Role Tests</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Is student:</span>
                  <span className={`font-semibold ${isStudent ? 'text-green-600' : 'text-red-600'}`}>
                    {isStudent ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Is teacher:</span>
                  <span className={`font-semibold ${isTeacher ? 'text-green-600' : 'text-red-600'}`}>
                    {isTeacher ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Is admin:</span>
                  <span className={`font-semibold ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    {isAdmin ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Is teacher or admin:</span>
                  <span className={`font-semibold ${isTeacherOrAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    {isTeacherOrAdmin ? 'Yes' : 'No'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate(-1)}>Go Back</Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Refresh Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleProtectedRoute>
  );
}