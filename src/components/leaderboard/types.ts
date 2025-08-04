import { Player } from "../types/interfaces";

// Constants for better maintainability
export const SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 2,
  LEADERBOARD_LIMIT: 50,
} as const;

export const RANK_CONFIG = {
  TOP_THREE_THRESHOLD: 3,
  MEDALS: {
    FIRST: '🥇',
    SECOND: '🥈', 
    THIRD: '🥉',
  },
  COLORS: {
    FIRST: 'text-yellow-600',
    SECOND: 'text-gray-500',
    THIRD: 'text-orange-600',
    DEFAULT: 'text-gray-400',
  },
} as const;

export const MESSAGES = {
  TITLE: '🏆 Leaderboard',
  SUBTITLE: "See who's leading the math challenge!",
  SEARCH_PLACEHOLDER: "Search players...",
  NO_PLAYERS_SEARCH: "No players found",
  NO_PLAYERS_DEFAULT: "No players yet",
  GAMES_PLAYED: (count: number) => `${count} game${count !== 1 ? 's' : ''} played`,
  CURRENT_CHAMPION: "Current Champion",
  ACTIVE_PLAYERS: "Active Players",
  HIGHEST_SCORE: "Highest Score",
} as const;

export const ICONS = {
  SEARCH: '🔍',
  EMPTY_SEARCH: '😔',
  CROWN: '👑',
  GAME: '🎮',
  TROPHY: '🏆',
} as const;

// Types for component props and internal state
export interface LeaderboardProps {
  className?: string;
  onPlayerClick?: (player: Player) => void;
}

export interface RankDisplayProps {
  rank: number | string;
  isTopThree: boolean;
}

export interface PlayerCardProps {
  player: Player;
  rank: number | string;
  isTopThree: boolean;
  onClick?: (player: Player) => void;
}

export interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  gradient: string;
}