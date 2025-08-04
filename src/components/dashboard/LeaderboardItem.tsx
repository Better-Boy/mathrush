import React from 'react';
import { LeaderboardItemProps } from './types';
import './style.css';

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ player, rank }) => (
  <div className="leaderboard-item">
    <div className="leaderboard-player">
      <div className="leaderboard-rank">
        #{rank}
      </div>
      <div 
        className="leaderboard-avatar"
        style={{ backgroundColor: player.profileColor }}
      >
        {player.profileIcon}
      </div>
      <span className="leaderboard-name">{player.username}</span>
    </div>
    <div className="leaderboard-score">
      {player.overallScore}
    </div>
  </div>
);

export default LeaderboardItem;