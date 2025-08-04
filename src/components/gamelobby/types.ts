import { Id } from "../../../convex/_generated/dataModel";
import { 
  CreateGameForm,
  DifficultyLevel 
} from "../../types/interfaces";

// Define the view types for better type safety
export type AppView = 'dashboard' | 'lobby' | 'game' | 'leaderboard' | 'profile' | 'settings';

export interface GameLobbyProps {
  setCurrentView: (view: AppView) => void;
  setCurrentGameId: (id: Id<"games"> | null) => void;
}

export interface DifficultyButtonProps {
  level: DifficultyLevel;
  isSelected: boolean;
  onClick: (level: DifficultyLevel) => void;
}

export interface TopicRadioProps {
  topic: string;
  isSelected: boolean;
  onChange: (topic: string) => void;
}

export interface CreateGameSectionProps {
  gameSettings: CreateGameForm;
  setGameSettings: (settings: CreateGameForm) => void;
  onCreateGame: () => void;
  availableTopics: string[];
}

export interface JoinGameSectionProps {
  inviteCode: string;
  setInviteCode: (code: string) => void;
  onJoinGame: () => void;
}