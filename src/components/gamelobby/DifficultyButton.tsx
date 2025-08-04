import React from 'react';
import { DifficultyButtonProps } from './types';
import './style.css';

const DifficultyButton: React.FC<DifficultyButtonProps> = ({ 
  level, 
  isSelected, 
  onClick 
}) => (
  <button
    onClick={() => onClick(level)}
    className={`difficulty-button ${isSelected ? 'selected' : ''}`}
  >
    {level.charAt(0).toUpperCase() + level.slice(1)}
  </button>
);

export default DifficultyButton;