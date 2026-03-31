import React from 'react';
import './GlassButton.css';

const GlassButton = ({ color, title, subtitle, icon }) => {
  return (
    <div className={`glass-button ${color}`}>
      {icon && <span className="icon">{icon}</span>}
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
};

export default GlassButton;
