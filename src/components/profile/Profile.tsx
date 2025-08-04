import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Player } from "../../types/interfaces";
import { calculateWinRate } from "./utils";
import { achievements } from "./utils";
import ProfileStat from "./Stat";
import AchievementBadge from "./AchievementBadge";
import "./style.css";

export function PlayerProfile() {
  // Type-safe query
  const currentPlayer = useQuery(api.players.getCurrentPlayer) as Player | undefined;
  
  // Handle loading state
  if (!currentPlayer) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading your profile...</div>
      </div>
    );
  }
  
  const winRate = calculateWinRate(currentPlayer);
  
  // Stats configuration
  const stats = [
    {
      value: currentPlayer.questionsAttempted,
      label: "Questions Attempted",
      color: "orange" as const
    },
    {
      value: currentPlayer.overallScore,
      label: "Total Score", 
      color: "blue" as const
    },
    {
      value: currentPlayer.gamesPlayed,
      label: "Games Played",
      color: "green" as const
    },
    {
      value: `${winRate}%`,
      label: "Accuracy",
      color: "purple" as const
    }
  ];
  
  // Filter unlocked achievements
  const unlockedAchievements = achievements.filter(achievement => 
    achievement.condition(currentPlayer, winRate)
  );
  
  const hasNoAchievements = currentPlayer.gamesPlayed === 0;
  
  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-title">
          <span className="gradient-text">👤 Player Profile</span>
        </h1>
        <p className="profile-subtitle">Your math journey stats and achievements</p>
      </div>
      
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-info">
          <div 
            className="profile-avatar"
            style={{ backgroundColor: currentPlayer.profileColor }}
          >
            {currentPlayer.profileIcon}
          </div>
          <div className="profile-details">
            <h2 className="profile-username">
              {currentPlayer.username}
            </h2>
            <p className="profile-email">{currentPlayer.email}</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <ProfileStat
              key={index}
              value={stat.value}
              label={stat.label}
              color={stat.color}
            />
          ))}
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="achievements-section">
        <h3 className="achievements-title">
          🏆 Achievements
        </h3>
        
        <div className="achievements-list">
          {hasNoAchievements ? (
            <div className="empty-state">
              <div className="empty-state-icon">🌟</div>
              <p>Play your first game to unlock achievements!</p>
            </div>
          ) : (
            unlockedAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
                color={achievement.color}
                isUnlocked={true}
              />
            ))
          )}
          
          {!hasNoAchievements && unlockedAchievements.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <p>Keep playing to unlock your first achievement!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}