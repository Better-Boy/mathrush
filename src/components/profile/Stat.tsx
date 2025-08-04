import React from 'react';
import { ProfileStatProps } from './types';
import './style.css';

const ProfileStat: React.FC<ProfileStatProps> = ({ value, label, color }) => {
  return (
    <div className={`profile-stat ${color}`}>
      <div className="profile-stat-value">
        {value}
      </div>
      <div className="profile-stat-label">{label}</div>
    </div>
  );
};

export default ProfileStat;