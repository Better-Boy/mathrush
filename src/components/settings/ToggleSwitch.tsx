import React from 'react';
import { ToggleSwitchProps } from './types';
import './style.css';

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  id, 
  checked, 
  onChange, 
  color = 'purple',
  disabled = false 
}) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="toggle-input"
      />
      <div className={`toggle-slider ${color} ${disabled ? 'disabled' : ''}`}></div>
    </label>
  );
};

export default ToggleSwitch;