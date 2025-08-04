import React from 'react';
import { StatCardProps } from './types';
import './style.css';

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colorClass = `stat-card-${color}`;
  const iconClass = `stat-icon-${color}`;
  const valueClass = `stat-value-${color}`;

  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-content">
        <div className={`stat-icon ${iconClass}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="stat-details">
          <p className="stat-label">{label}</p>
          <p className={`stat-value ${valueClass}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;