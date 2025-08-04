import React from 'react';
import { TopicRadioProps } from './types';
import './style.css';

const TopicRadio: React.FC<TopicRadioProps> = ({ 
  topic, 
  isSelected, 
  onChange 
}) => (
  <label className="topic-radio">
    <input
      type="radio"
      checked={isSelected}
      onChange={(e) => e.target.checked && onChange(topic)}
      className="topic-radio-input"
    />
    <span className="topic-radio-label">{topic}</span>
  </label>
);

export default TopicRadio;