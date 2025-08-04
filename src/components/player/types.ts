// Constants for better maintainability
export const USERNAME_CONFIG = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 20,
  PATTERN: /^[a-zA-Z0-9_-]+$/,
} as const;

export const MESSAGES = {
  SUCCESS: "Welcome to MathRush! 🎉",
  ERROR_DEFAULT: "Failed to create player",
  ERROR_INVALID_USERNAME: "Username must be 2-20 characters and contain only letters, numbers, hyphens, and underscores",
  ERROR_REQUIRED: "Username is required",
  CREATING: "Creating...",
  CREATE_BUTTON: "Create Player 🚀",
  AVATAR_INFO: "You'll get a random colorful avatar and can start playing immediately!",
} as const;

// Form validation type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Component props interface for future extensibility
export interface CreatePlayerProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}