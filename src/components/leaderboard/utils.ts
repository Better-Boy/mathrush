import { RANK_CONFIG } from './types';

export const getRankColor = (rank: number | string): string => {
  if (typeof rank !== 'number') return RANK_CONFIG.COLORS.DEFAULT;
  
  switch (rank) {
    case 1: return RANK_CONFIG.COLORS.FIRST;
    case 2: return RANK_CONFIG.COLORS.SECOND;
    case 3: return RANK_CONFIG.COLORS.THIRD;
    default: return RANK_CONFIG.COLORS.DEFAULT;
  }
};

export const getRankDisplay = (rank: number | string): string => {
  if (typeof rank !== 'number') return String(rank);
  
  switch (rank) {
    case 1: return RANK_CONFIG.MEDALS.FIRST;
    case 2: return RANK_CONFIG.MEDALS.SECOND;
    case 3: return RANK_CONFIG.MEDALS.THIRD;
    default: return `#${rank}`;
  }
};