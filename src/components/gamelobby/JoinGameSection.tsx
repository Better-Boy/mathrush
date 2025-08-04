import React from 'react';
import { JoinGameSectionProps } from './types';
import './style.css';

const JoinGameSection: React.FC<JoinGameSectionProps> = ({
  inviteCode,
  setInviteCode,
  onJoinGame
}) => {
  const isJoinDisabled = inviteCode.length !== 6;
  
  const handleInviteCodeChange = (value: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const cleanedValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleanedValue.length <= 6) {
      setInviteCode(cleanedValue);
    }
  };

  return (
    <div className="game-card join-game">
      <h2 className="game-card-title">
        🎯 Join Game
      </h2>
      
      <div className="game-form">
        {/* Invite Code Input */}
        <div className="form-group">
          <label className="form-label">
            Invite Code
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => handleInviteCodeChange(e.target.value)}
            placeholder="Enter 6-character code"
            maxLength={6}
            className="form-input invite-code"
          />
          <p className="form-help">
            Ask your friend for their game's invite code
          </p>
        </div>
        
        {/* Join Button */}
        <div className="form-actions">
          <button
            onClick={onJoinGame}
            disabled={isJoinDisabled}
            className="form-button join-button"
          >
            Enter Game 🎯
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGameSection;