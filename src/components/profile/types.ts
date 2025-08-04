import { Player } from "../../types/interfaces";

export interface ProfileStatProps {
  value: number | string;
  label: string;
  color: 'orange' | 'blue' | 'green' | 'purple';
}

export interface AchievementProps {
  icon: string;
  title: string;
  description: string;
  color: 'yellow' | 'blue' | 'green' | 'purple';
  isUnlocked: boolean;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: 'yellow' | 'blue' | 'green' | 'purple';
  condition: (player: Player, winRate: number) => boolean;
}