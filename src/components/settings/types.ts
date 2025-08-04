export type AppView = 'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings';

export interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: 'purple' | 'pink';
  disabled?: boolean;
}

export interface EmailPreferenceCardProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: 'purple' | 'pink';
  disabled?: boolean;
}

export interface FeedbackFormData {
  message: string;
  category: 'general' | 'bug' | 'feature';
}