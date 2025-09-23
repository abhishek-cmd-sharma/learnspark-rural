import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "./types";
import { useAuth } from "@/contexts/AuthContext";

// Define roles and permissions
export type Role = "student" | "teacher" | "admin";

export interface Permission {
  action: string;
  resource: string;
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  student: [
    { action: "read", resource: "lessons" },
    { action: "read", resource: "quizzes" },
    { action: "create", resource: "quiz_attempts" },
    { action: "read", resource: "progress" },
    { action: "read", resource: "achievements" },
    { action: "read", resource: "contests" },
    { action: "create", resource: "contest_participations" },
  ],
  teacher: [
    { action: "read", resource: "lessons" },
    { action: "create", resource: "lessons" },
    { action: "update", resource: "lessons" },
    { action: "delete", resource: "lessons" },
    { action: "read", resource: "quizzes" },
    { action: "create", resource: "quizzes" },
    { action: "update", resource: "quizzes" },
    { action: "delete", resource: "quizzes" },
    { action: "read", resource: "student_progress" },
    { action: "read", resource: "class_data" },
    { action: "create", resource: "assignments" },
    { action: "update", resource: "assignments" },
    { action: "delete", resource: "assignments" },
    { action: "read", resource: "contests" },
    { action: "create", resource: "contests" },
    { action: "update", resource: "contests" },
    { action: "delete", resource: "contests" },
  ],
  admin: [
    { action: "read", resource: "all_data" },
    { action: "create", resource: "all_data" },
    { action: "update", resource: "all_data" },
    { action: "delete", resource: "all_data" },
    { action: "manage", resource: "users" },
    { action: "manage", resource: "roles" },
    { action: "manage", resource: "system_settings" },
 ],
};

// Check if a user has a specific permission
export const hasPermission = (user: User, action: string, resource: string): boolean => {
  // Admins have all permissions
  if (user.role === "admin") {
    return true;
  }

  // Check if the user's role has the required permission
  const permissions = ROLE_PERMISSIONS[user.role];
  return permissions.some(
    (permission) => permission.action === action && permission.resource === resource
  );
};

// Check if a user has a specific role
export const hasRole = (user: User, role: Role): boolean => {
  return user.role === role;
};

// Check if a user has any of the specified roles
export const hasAnyRole = (user: User, roles: Role[]): boolean => {
  return roles.includes(user.role);
};

// Assign a role to a user
export const assignRole = async (userId: string, role: Role): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      role: role,
    });
  } catch (error) {
    console.error("Error assigning role:", error);
    throw error;
  }
};

// Get user role
export const getUserRole = async (userId: string): Promise<Role | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.role as Role;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
};

// Check if user can access a specific route
export const canAccessRoute = (user: User, route: string): boolean => {
  // Admins can access all routes
  if (user.role === "admin") {
    return true;
  }

  // Define route access permissions
  const routePermissions: Record<string, { action: string; resource: string }> = {
    "/dashboard": { action: "read", resource: "dashboard" },
    "/student-dashboard": { action: "read", resource: "dashboard" },
    "/teacher-dashboard": { action: "read", resource: "dashboard" },
    "/lessons": { action: "read", resource: "lessons" },
    "/quizzes": { action: "read", resource: "quizzes" },
    "/progress": { action: "read", resource: "progress" },
    "/achievements": { action: "read", resource: "achievements" },
    "/contests": { action: "read", resource: "contests" },
    "/create-contest": { action: "create", resource: "contests" },
    "/quiz-management": { action: "manage", resource: "quizzes" },
    "/lesson-management": { action: "manage", resource: "lessons" },
    "/student-management": { action: "manage", resource: "students" },
    "/reports": { action: "read", resource: "reports" },
  };

  // If route is not defined in permissions, deny access by default
  if (!routePermissions[route]) {
    return false;
  }

  const { action, resource } = routePermissions[route];
 return hasPermission(user, action, resource);
};
// Custom hook for checking permissions in components
export const usePermission = () => {
  const { userData } = useAuth();
  
  const checkPermission = (action: string, resource: string): boolean => {
    if (!userData) return false;
    return hasPermission(userData, action, resource);
  };
  
  const checkRole = (role: Role): boolean => {
    if (!userData) return false;
    return hasRole(userData, role);
  };
  
  const checkAnyRole = (roles: Role[]): boolean => {
    if (!userData) return false;
    return hasAnyRole(userData, roles);
  };
  
  return {
    checkPermission,
    checkRole,
    checkAnyRole,
    userRole: userData?.role,
    hasUser: !!userData
  };
};