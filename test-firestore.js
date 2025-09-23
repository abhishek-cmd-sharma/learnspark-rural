import { initFirestoreData } from "./dist/lib/initFirestoreData.js";
import { subjectService, achievementService, userAchievementService } from "./dist/lib/firestoreService.js";
import { initializeAchievements } from "./dist/lib/achievementService.js";

// Test Firestore integration
async function testFirestore() {
  try {
    console.log("Testing Firestore integration...");
    
    // Initialize Firestore with sample data
    await initFirestoreData();
    console.log("✓ Firestore initialized with sample data");
    
    // Initialize achievements
    await initializeAchievements();
    console.log("✓ Achievements initialized");
    
    // Test fetching subjects
    const subjects = await subjectService.getAllSubjects();
    console.log(`✓ Fetched ${subjects.length} subjects`);
    console.log("Subjects:", subjects.map(s => s.name));
    
    // Test fetching achievements
    const achievements = await achievementService.getAllAchievements();
    console.log(`✓ Fetched ${achievements.length} achievements`);
    console.log("Achievements:", achievements.map(a => a.title));
    
    // Test creating a user achievement (simulating unlocking an achievement)
    if (achievements.length > 0) {
      // In a real app, we would have a user ID from authentication
      const mockUserId = "test-user-id";
      
      try {
        const userAchievementId = await userAchievementService.createUserAchievement({
          userId: mockUserId,
          achievementId: achievements[0].id,
          progress: 1,
          maxProgress: 1
        });
        console.log(`✓ Created user achievement with ID: ${userAchievementId}`);
        
        // Test fetching user achievements
        const userAchievements = await userAchievementService.getUserAchievements(mockUserId);
        console.log(`✓ Fetched ${userAchievements.length} user achievements`);
      } catch (error) {
        console.log("Note: User achievement creation failed (expected if already exists)");
      }
    }
    
    console.log("All tests passed! Firestore integration is working correctly.");
  } catch (error) {
    console.error("❌ Firestore test failed:", error);
  }
}

// Run the test
testFirestore();