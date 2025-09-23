// Test contests functionality
import { contestServiceFunctions } from "./src/lib/contestService.ts";
import { subjectService } from "./src/lib/firestoreService.ts";

async function testContests() {
  console.log("Testing contests functionality...");
  
  try {
    // Get all active contests
    console.log("Fetching active contests...");
    const activeContests = await contestServiceFunctions.getActiveContests();
    console.log(`Found ${activeContests.length} active contests`);
    
    // Get all upcoming contests
    console.log("Fetching upcoming contests...");
    const upcomingContests = await contestServiceFunctions.getUpcomingContests();
    console.log(`Found ${upcomingContests.length} upcoming contests`);
    
    // Display contest information
    if (activeContests.length > 0) {
      console.log("\nActive Contests:");
      activeContests.forEach(contest => {
        console.log(`- ${contest.title} (${contest.difficulty})`);
        console.log(`  Prize: ${contest.prize}`);
        console.log(`  Participants: ${contest.participants?.length || 0}`);
      });
    }
    
    if (upcomingContests.length > 0) {
      console.log("\nUpcoming Contests:");
      upcomingContests.forEach(contest => {
        console.log(`- ${contest.title} (${contest.difficulty})`);
        console.log(`  Prize: ${contest.prize}`);
        console.log(`  Starts: ${contest.startDate}`);
      });
    }
    
    console.log("\nContests functionality test completed successfully!");
  } catch (error) {
    console.error("Error testing contests functionality:", error);
 }
}

// Run the test
testContests();