import { Player } from "../../types/interfaces";

// Define the view types for better type safety
export type AppView = 'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings';

export interface DashboardProps {
  setCurrentView: (view: AppView) => void;
}

export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: 'orange' | 'blue' | 'green' | 'purple';
}

export interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  gradient: string;
  textColor: string;
  onClick: () => void;
}

export interface LeaderboardItemProps {
  player: Player;
  rank: number;
}