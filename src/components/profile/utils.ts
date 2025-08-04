import { Achievement } from './types';
import { Player } from "../../types/interfaces";

export const achievements: Achievement[] = [
  {
    id: 'first_game',
    icon: '🎮',
    title: 'First Game',
    description: 'Played your first math quiz',
    color: 'yellow',
    condition: (player) => player.gamesPlayed >= 1
  },
  {
    id: 'getting_warmed_up',
    icon: '🔥',
    title: 'Getting Warmed Up',
    description: 'Played 10 games',
    color: 'blue',
    condition: (player) => player.gamesPlayed >= 10
  },
  {
    id: 'sharp_shooter',
    icon: '🎯',
    title: 'Sharp Shooter',
    description: '50 correct answers',
    color: 'green',
    condition: (player) => player.overallScore >= 250 // 50 correct × 5 points each
  },
  {
    id: 'math_master',
    icon: '🏆',
    title: 'Math Master',
    description: '80%+ accuracy',
    color: 'purple',
    condition: (player, winRate) => winRate >= 80 && player.gamesPlayed >= 5
  }
];

// Helper function to calculate win rate
export const calculateWinRate = (player: Player): number => {
  if (player.questionsAttempted === 0) return 0;
  
  const correctAnswers = player.overallScore / 5; // Assuming 5 points per correct answer
  return Math.round((correctAnswers / player.questionsAttempted) * 100);
};