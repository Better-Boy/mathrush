import React, { useCallback } from 'react';
import { PlayerCardProps } from './types';
import RankDisplay from './RankDisplay';
import './style.css';

const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank, isTopThree, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.(player);
  }, [onClick, player]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div 
      className={`player-card ${isTopThree ? 'top-three' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View ${player.username}'s profile` : undefined}
    >
      <div className="player-info">
        <RankDisplay rank={rank} isTopThree={isTopThree} />
        
        <div 
          className="player-avatar"
          style={{ backgroundColor: player.profileColor }}
          role="img"
          aria-label={`${player.username}'s avatar`}
        >
          {player.profileIcon}
        </div>
        
        <div className="player-details">
          <div className="player-name">
            {player.username}
          </div>
          <div className="player-stats">
            {player.gamesPlayed} game{player.gamesPlayed !== 1 ? 's' : ''} played
          </div>
        </div>
      </div>
      
      <div className="player-score">
        {player.overallScore.toLocaleString()}
      </div>
    </div>
  );
};

export default PlayerCard;