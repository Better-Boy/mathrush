import React from 'react';
import { StatCardProps } from './types';
import './style.css';

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, gradient }) => (
  <div className={`stat-card ${gradient}`}>
    <div className="stat-icon" role="img" aria-hidden="true">
      {icon}
    </div>
    <div className="stat-value">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="stat-label">{label}</div>
  </div>
);

export default StatCard;