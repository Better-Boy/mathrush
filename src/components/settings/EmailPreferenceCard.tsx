import React from 'react';
import { EmailPreferenceCardProps } from './types';
import ToggleSwitch from './ToggleSwitch';
import './style.css';

const EmailPreferenceCard: React.FC<EmailPreferenceCardProps> = ({
  title,
  description,
  checked,
  onChange,
  color = 'purple',
  disabled = false
}) => {
  return (
    <div className={`email-preference-card ${color}`}>
      <div className="preference-content">
        <div className="preference-title">{title}</div>
        <div className="preference-description">{description}</div>
      </div>
      <ToggleSwitch
        id={title.toLowerCase().replace(/\s+/g, '-')}
        checked={checked}
        onChange={onChange}
        color={color}
        disabled={disabled}
      />
    </div>
  );
};

export default EmailPreferenceCard;