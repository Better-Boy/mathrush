import React from 'react';
import { CreateGameSectionProps } from './types';
import { QUESTION_OPTIONS } from './constants';
import DifficultyButton from './DifficultyButton';
import TopicRadio from './TopicRadio';
import {  
  CreateGameForm, 
  DIFFICULTY_LEVELS 
} from "../../types/interfaces";
import './style.css';

const CreateGameSection: React.FC<CreateGameSectionProps> = ({
  gameSettings,
  setGameSettings,
  onCreateGame,
  availableTopics
}) => {
  const updateGameSettings = (updates: Partial<CreateGameForm>) => {
    setGameSettings({ ...gameSettings, ...updates });
  };

  const isCreateDisabled = !gameSettings.topic;

  return (
    <div className="game-card create-game">
      <h2 className="game-card-title">
        ✨ New Game
      </h2>
      
      <div className="game-form">
        {/* Number of Questions */}
        <div className="form-group">
          <label className="form-label">
            Number of Questions
          </label>
          <select
            value={gameSettings.maxQuestions}
            onChange={(e) => updateGameSettings({ 
              maxQuestions: parseInt(e.target.value) 
            })}
            className="form-select"
          >
            {QUESTION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Difficulty Level */}
        <div className="form-group">
          <label className="form-label">
            Difficulty Level
          </label>
          <div className="difficulty-buttons">
            {Object.values(DIFFICULTY_LEVELS).map((level) => (
              <DifficultyButton
                key={level}
                level={level}
                isSelected={gameSettings.difficulty === level}
                onClick={(selectedLevel) => updateGameSettings({ 
                  difficulty: selectedLevel 
                })}
              />
            ))}
          </div>
        </div>
        
        {/* Math Topics */}
        <div className="form-group">
          <label className="form-label">
            Math Topics
          </label>
          <div className="topics-grid">
            {availableTopics.map((topic) => (
              <TopicRadio
                key={topic}
                topic={topic}
                isSelected={gameSettings.topic === topic}
                onChange={(selectedTopic) => updateGameSettings({ 
                  topic: selectedTopic 
                })}
              />
            ))}
          </div>
        </div>
        
        {/* Create Button */}
        <div className="form-actions">
          <button
            onClick={onCreateGame}
            disabled={isCreateDisabled}
            className="form-button create-button"
          >
            Create 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGameSection;