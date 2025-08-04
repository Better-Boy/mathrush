import { Doc, Id } from "../../convex/_generated/dataModel";

// Base interfaces matching your Convex schema
export interface Player extends Doc<"players"> {
  userId: Id<"users">;
  username: string;
  email: string;
  profileIcon: string;
  profileColor: string;
  lastActive: number;
  gamesPlayed: number;
  questionsAttempted: number;
  overallScore: number;
}

export interface Game extends Doc<"games"> {
  hostId: Id<"players">;
  maxQuestions: number;
  difficulty: "easy" | "medium" | "hard";
  status: "waiting" | "active" | "finished";
  topic: string;
  inviteCode?: string;
  date: string; // YYYY-MM-DD format
}

export interface GameParticipant extends Doc<"gameParticipants"> {
  gameId: Id<"games">;
  playerId: Id<"players">;
  currentQuestionCount: number;
  playerStatus: "active" | "inactive";
  score: number;
}

export interface GameParticipantQuestion extends Doc<"gameParticipantQuestion"> {
  gameId: Id<"games">;
  playerId: Id<"players">;
  questionId: Id<"questions">;
  answerGivenByPlayer: number;
  score: number;
}

export interface Question extends Doc<"questions"> {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  explanation: string;
}

export interface EmailPreferences extends Doc<"emailPreferences"> {
  playerId: Id<"players">;
  dailyQuestions: boolean;
  weeklyReports: boolean;
  gameResults: boolean;
  email: string;
}

export interface GameInvitation extends Doc<"gameInvitations"> {
  gameId: Id<"games">;
  email: string;
  emailStatus: string;
  gameJoinStatus: boolean;
  sentAt: number;
  sentBy: Id<"players">;
  resendId: string;
}

// Utility types for creating new documents (without _id and _creationTime)
export type NewPlayer = Omit<Player, "_id" | "_creationTime">;
export type NewGame = Omit<Game, "_id" | "_creationTime">;
export type NewGameParticipant = Omit<GameParticipant, "_id" | "_creationTime">;
export type NewGameParticipantQuestion = Omit<GameParticipantQuestion, "_id" | "_creationTime">;
export type NewQuestion = Omit<Question, "_id" | "_creationTime">;
export type NewEmailPreferences = Omit<EmailPreferences, "_id" | "_creationTime">;
export type NewGameInvitation = Omit<GameInvitation, "_id" | "_creationTime">;

// Partial types for updates (all fields optional except _id)
export type PlayerUpdate = Partial<Omit<Player, "_id" | "_creationTime">> & { _id: Id<"players"> };
export type GameUpdate = Partial<Omit<Game, "_id" | "_creationTime">> & { _id: Id<"games"> };
export type GameParticipantUpdate = Partial<Omit<GameParticipant, "_id" | "_creationTime">> & { _id: Id<"gameParticipants"> };
export type GameParticipantQuestionUpdate = Partial<Omit<GameParticipantQuestion, "_id" | "_creationTime">> & { _id: Id<"gameParticipantQuestion"> };
export type QuestionUpdate = Partial<Omit<Question, "_id" | "_creationTime">> & { _id: Id<"questions"> };
export type EmailPreferencesUpdate = Partial<Omit<EmailPreferences, "_id" | "_creationTime">> & { _id: Id<"emailPreferences"> };
export type GameInvitationUpdate = Partial<Omit<GameInvitation, "_id" | "_creationTime">> & { _id: Id<"gameInvitations"> };

// Enum-like constants for better type safety and reusability
export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium", 
  HARD: "hard"
} as const;

export const GAME_STATUS = {
  WAITING: "waiting",
  ACTIVE: "active",
  FINISHED: "finished"
} as const;

export const PLAYER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive"
} as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];
export type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS];
export type PlayerStatus = typeof PLAYER_STATUS[keyof typeof PLAYER_STATUS];

// Computed/derived interfaces for common use cases
export interface PlayerWithStats extends Player {
  averageScore?: number;
  winRate?: number;
  activeGames?: number;
}

export interface GameWithHost extends Game {
  host?: Player;
  participantCount?: number;
}

export interface GameParticipantWithPlayer extends GameParticipant {
  player?: Player;
}

export interface GameParticipantWithDetails extends GameParticipant {
  player?: Player;
  game?: Game;
}

export interface QuestionWithUserAnswer extends Question {
  userAnswer?: number;
  isCorrect?: boolean;
  userScore?: number;
}

// Response interfaces for API calls
export interface GameLeaderboard {
  gameId: Id<"games">;
  participants: Array<{
    player: Player;
    score: number;
    questionsAnswered: number;
    rank: number;
  }>;
}

export interface PlayerStats {
  player: Player;
  totalGames: number;
  totalQuestions: number;
  averageScore: number;
  bestScore: number;
  recentGames: Game[];
}

export interface GameSummary {
  game: Game;
  host: Player;
  participants: GameParticipantWithPlayer[];
  totalQuestions: number;
  averageScore: number;
}

// Form interfaces for React components
export interface CreateGameForm {
  maxQuestions: number;
  difficulty: DifficultyLevel;
  topic: string;
  inviteEmails?: string[];
}

export interface JoinGameForm {
  inviteCode: string;
}

export interface UpdateProfileForm {
  username: string;
  profileIcon: string;
  profileColor: string;
}

export interface EmailPreferencesForm {
  dailyQuestions: boolean;
  weeklyReports: boolean;
  gameResults: boolean;
}