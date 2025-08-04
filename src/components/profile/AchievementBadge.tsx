import React from 'react';
import { AchievementProps } from './types';
import './style.css';

const AchievementBadge: React.FC<AchievementProps> = ({ 
  icon, 
  title, 
  description, 
  color, 
  isUnlocked 
}) => {
  if (!isUnlocked) return null;
  
  return (
    <div className={`achievement-badge ${color}`}>
      <span className="achievement-icon">{icon}</span>
      <div className="achievement-content">
        <div className="achievement-title">{title}</div>
        <div className="achievement-description">{description}</div>
      </div>
    </div>
  );
};

export default AchievementBadge;