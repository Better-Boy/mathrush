import React from 'react';
import { ActionCardProps } from './types';
import './style.css';

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  buttonText, 
  gradient, 
  textColor, 
  onClick 
}) => (
  <div className={`action-card ${gradient}`}>
    <h3>{title}</h3>
    <p>{description}</p>
    <button
      onClick={onClick}
      className={`action-button ${textColor}`}
    >
      {buttonText}
    </button>
  </div>
);

export default ActionCard;