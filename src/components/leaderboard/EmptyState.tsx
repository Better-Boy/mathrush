import React from 'react';
import { ICONS, MESSAGES } from './types';
import './style.css';

interface EmptyStateProps {
  isSearching: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isSearching }) => (
  <div className="empty-state">
    <div className="empty-icon" role="img" aria-label="No results">
      {ICONS.EMPTY_SEARCH}
    </div>
    <p className="empty-text">
      {isSearching ? MESSAGES.NO_PLAYERS_SEARCH : MESSAGES.NO_PLAYERS_DEFAULT}
    </p>
  </div>
);

export default EmptyState;