import React from 'react';
import { RankDisplayProps } from './types';
import { getRankColor, getRankDisplay } from './utils';
import './style.css';

const RankDisplay: React.FC<RankDisplayProps> = ({ rank, isTopThree }) => (
  <div className={`rank-display ${getRankColor(rank)}`}>
    {getRankDisplay(rank)}
  </div>
);

export default RankDisplay;