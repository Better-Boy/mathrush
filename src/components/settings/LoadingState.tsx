import React from 'react';
import './style.css';

const LoadingState: React.FC = () => (
  <div className="settings-container">
    <div className="settings-header">
      <div className="settings-icon">⚙️</div>
      <h1 className="settings-title">
        <span className="gradient-text">Settings</span>
      </h1>
      <p className="settings-subtitle">Loading your preferences...</p>
    </div>
  </div>
);

export default LoadingState;