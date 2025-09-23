import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { ProfileDisplay } from "@/components/ProfileDisplay";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/authService";
import { toast } from "sonner";
import { LogOut, User, Settings } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { userProfile, loading } = useProfile();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("view");
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            View Profile
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Edit Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-6">
          <ProfileDisplay onEdit={() => setActiveTab("edit")} />
        </TabsContent>
        
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};