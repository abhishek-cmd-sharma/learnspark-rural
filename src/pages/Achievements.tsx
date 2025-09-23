import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { Achievement, UserAchievement } from "@/lib/types";

export default function Achievements() {
  const { user, achievements, userAchievements, loadingUserAchievements, loadingAchievements } = useFirestore();
  const { userData } = useAuth();
  
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    level: 1,
    studyStreak: 0,
    gems: 0,
    badges: 0
  });

  const [processedAchievements, setProcessedAchievements] = useState<any[]>([]);

  useEffect(() => {
    // Update user stats from real data
    if (userData) {
      setUserStats({
        totalXP: userData.xp || 0,
        level: userData.level || 1,
        studyStreak: userData.streak || 0,
        gems: 0, // Would need to fetch from Firestore if stored there
        badges: userAchievements.length
      });
    }
  }, [userData, userAchievements]);

  useEffect(() => {
    // Process achievements to match the expected format
    if (!loadingAchievements && !loadingUserAchievements) {
      const processed = achievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
        return {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          rarity: achievement.rarity,
          unlocked: !!userAchievement,
          progress: userAchievement?.progress || 0,
          maxProgress: userAchievement?.maxProgress || 100
        };
      });
      setProcessedAchievements(processed);
    }
  }, [achievements, userAchievements, loadingUserAchievements]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "bronze": return "bg-gradient-to-r from-amber-700 to-amber-900";
      case "silver": return "bg-gradient-to-r from-gray-300 to-gray-500";
      case "gold": return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "platinum": return "bg-gradient-to-r from-blue-300 to-blue-500";
      default: return "bg-gradient-to-r from-gray-200 to-gray-400";
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "bronze": return "shadow-amber-700/30";
      case "silver": return "shadow-gray-300/30";
      case "gold": return "shadow-yellow-400/30";
      case "platinum": return "shadow-blue-300/30";
      default: return "shadow-gray-200/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Achievements Page */}
      <div id="achievements" className="page active">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🏅 Achievements & Badges</h2>
            <p className="text-gray-600">Celebrate your learning milestones!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Earned Achievements */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-6">🎉 Earned Achievements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processedAchievements.filter(a => a.unlocked).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="achievement-badge rounded-2xl p-6 text-center"
                  >
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="text-xs text-gray-500">Earned recently</div>
                  </div>
                ))}
              </div>
              
              {/* Locked Achievements */}
              <h3 className="text-xl font-bold text-gray-800 mb-6 mt-8">🔒 Upcoming Achievements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processedAchievements.filter(a => !a.unlocked).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="bg-gray-100 rounded-2xl p-6 text-center opacity-75"
                  >
                    <div className="text-4xl mb-4 grayscale">{achievement.icon}</div>
                    <h4 className="text-lg font-bold text-gray-600 mb-2">{achievement.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                    <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${((achievement.progress || 0) / (achievement.maxProgress || 1) * 100) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {achievement.progress || 0}/{achievement.maxProgress || 0} completed
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Achievement Stats</h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{userStats.badges}/{processedAchievements.length}</div>
                    <div className="text-sm text-gray-600">Achievements Unlocked</div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${(userStats.badges / processedAchievements.length) * 100 || 0}%` }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-bold text-lg">6</div>
                      <div className="text-gray-600">This Month</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">2</div>
                      <div className="text-gray-600">This Week</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Next Milestone</h3>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">👑</div>
                  <h4 className="font-bold text-gray-800 mb-2">Subject King</h4>
                  <p className="text-sm text-gray-600 mb-4">Reach Level 10 in Mathematics</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                  <div className="text-sm text-gray-600">Level 9 → Level 10</div>
                  <div className="text-xs text-gray-500 mt-1">150 XP remaining</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Leaderboard Position</h3>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">#5</div>
                  <div className="text-sm text-gray-600 mb-4">in Class 8</div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Achievements:</span>
                      <span className="font-semibold">{userStats.badges}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total XP:</span>
                      <span className="font-semibold">{userStats.totalXP.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streak:</span>
                      <span className="font-semibold">{userStats.studyStreak} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}