import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { 
  USERNAME_CONFIG, 
  MESSAGES, 
  ValidationResult, 
  CreatePlayerProps 
} from "./types";
import "./style.css";

export function CreatePlayer({ 
  onSuccess, 
  onError, 
  className = "" 
}: CreatePlayerProps = {}) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const createPlayer = useMutation(api.players.createPlayer);
  
  // Validation logic extracted to separate function
  const validateUsername = useCallback((value: string): ValidationResult => {
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      return { isValid: false, error: MESSAGES.ERROR_REQUIRED };
    }
    
    if (trimmedValue.length < USERNAME_CONFIG.MIN_LENGTH || 
        trimmedValue.length > USERNAME_CONFIG.MAX_LENGTH) {
      return { isValid: false, error: MESSAGES.ERROR_INVALID_USERNAME };
    }
    
    if (!USERNAME_CONFIG.PATTERN.test(trimmedValue)) {
      return { isValid: false, error: MESSAGES.ERROR_INVALID_USERNAME };
    }
    
    return { isValid: true };
  }, []);
  
  // Handle input changes with real-time validation
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  }, [validationError]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validation = validateUsername(username);
    if (!validation.isValid) {
      setValidationError(validation.error || MESSAGES.ERROR_REQUIRED);
      return;
    }
    
    setIsLoading(true);
    setValidationError(null);
    
    try {
      await createPlayer({ username: username.trim() });
      
      // Success handling
      toast.success(MESSAGES.SUCCESS);
      onSuccess?.();
      
      // Reset form
      setUsername("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : MESSAGES.ERROR_DEFAULT;
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [username, validateUsername, createPlayer, onSuccess, onError]);
  
  // Compute form state
  const isFormValid = validateUsername(username).isValid;
  const shouldDisableSubmit = !isFormValid || isLoading;
  
  return (
    <div className={`create-player-container ${className}`}>
      <div className="create-player-card">
        {/* Header Section */}
        <header className="create-player-header">
          <div className="create-player-icon" role="img" aria-label="Game controller">
            🎮
          </div>
          <h2 className="create-player-title">
            Create Your Player
          </h2>
          <p className="create-player-subtitle">
            Choose a fun username to get started!
          </p>
        </header>
        
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="create-player-form" noValidate>
          <div className="form-group">
            <label 
              htmlFor="username" 
              className="form-label"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              className={`form-input ${validationError ? 'error' : ''}`}
              minLength={USERNAME_CONFIG.MIN_LENGTH}
              maxLength={USERNAME_CONFIG.MAX_LENGTH}
              pattern={USERNAME_CONFIG.PATTERN.source}
              required
              aria-invalid={!!validationError}
              aria-describedby={validationError ? "username-error" : "username-help"}
              disabled={isLoading}
            />
            
            {/* Validation Error */}
            {validationError && (
              <p id="username-error" className="form-error" role="alert">
                {validationError}
              </p>
            )}
            
            {/* Help Text */}
            <p id="username-help" className="form-help">
              {USERNAME_CONFIG.MIN_LENGTH}-{USERNAME_CONFIG.MAX_LENGTH} characters, letters, numbers, hyphens, and underscores only
            </p>
          </div>
          
          <button
            type="submit"
            disabled={shouldDisableSubmit}
            className="form-button"
            aria-describedby="button-help"
          >
            {isLoading ? (
              <>
                <div className="spinner" role="status" aria-label="Loading"></div>
                <span>{MESSAGES.CREATING}</span>
              </>
            ) : (
              MESSAGES.CREATE_BUTTON
            )}
          </button>
        </form>
        
        {/* Footer Section */}
        <footer className="create-player-footer">
          <p className="create-player-footer-text">
            {MESSAGES.AVATAR_INFO}
          </p>
        </footer>
      </div>
    </div>
  );
}