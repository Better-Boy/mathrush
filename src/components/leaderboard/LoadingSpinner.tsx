import React from './style.css';

const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div 
      className="spinner"
      role="status"
      aria-label="Loading leaderboard"
    />
  </div>
);

export default LoadingSpinner;