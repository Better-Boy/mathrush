import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Player } from "../../types/interfaces";
import { DashboardProps } from "./types";
import StatCard from "./StatCard";
import ActionCard from "./ActionCard";
import LeaderboardItem from "./LeaderboardItem";
import './style.css';

export function Dashboard({ setCurrentView }: DashboardProps) {
  // Type-safe queries
  const currentPlayer = useQuery(api.players.getCurrentPlayer) as Player | undefined;
  const leaderboard = useQuery(api.players.getLeaderboard, { limit: 5 }) as Player[] | undefined;
  
  // Handle loading state
  if (!currentPlayer) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading your dashboard...</div>
      </div>
    );
  }
  
  // Calculate stats with proper error handling
  const calculateWinRate = (player: Player): number => {
    if (player.questionsAttempted === 0) return 0;
    
    const correctAnswers = player.overallScore / 5; // Assuming 5 points per correct answer
    return Math.round((correctAnswers / player.questionsAttempted) * 100);
  };
  
  const winRate = calculateWinRate(currentPlayer);
  
  // Stats configuration
  const stats = [
    {
      icon: "⚡",
      label: "Total Questions Attempted",
      value: currentPlayer.questionsAttempted,
      color: "orange" as const
    },
    {
      icon: "🏆", 
      label: "Total Score",
      value: currentPlayer.overallScore,
      color: "blue" as const
    },
    {
      icon: "🎮",
      label: "Games Played", 
      value: currentPlayer.gamesPlayed,
      color: "green" as const
    },
    {
      icon: "✅",
      label: "Win Rate",
      value: `${winRate}%`,
      color: "purple" as const
    }
  ];
  
  // Action cards configuration
  const actionCards = [
    {
      title: "🚀 Start Playing",
      description: "Join a game or create your own room to challenge other players!",
      buttonText: "Go to Game Lobby",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
      textColor: "text-purple-600",
      onClick: () => setCurrentView('lobby')
    },
    {
      title: "🏆 Leaderboard", 
      description: "See how you rank against other math champions!",
      buttonText: "View Rankings",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      textColor: "text-blue-600",
      onClick: () => setCurrentView('leaderboard')
    }
  ];
  
  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div 
            className="profile-avatar"
            style={{ backgroundColor: currentPlayer.profileColor }}
          >
            {currentPlayer.profileIcon}
          </div>
          <div className="welcome-text">
            <h1>
              Welcome back, {currentPlayer.username}! 👋
            </h1>
            <p>Ready for some math fun?</p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="actions-grid">
        {actionCards.map((card, index) => (
          <ActionCard
            key={index}
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
            gradient={card.gradient}
            textColor={card.textColor}
            onClick={card.onClick}
          />
        ))}
      </div>
      
      {/* Mini Leaderboard */}
      {leaderboard && leaderboard.length > 0 && (
        <div className="leaderboard-section">
          <h3 className="leaderboard-title">
            🏆 Top Players
          </h3>
          <div className="leaderboard-list">
            {leaderboard.slice(0, 5).map((player, index) => (
              <LeaderboardItem
                key={player._id}
                player={player}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}