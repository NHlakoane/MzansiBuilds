import React from 'react';

function Card({ children, className = '', onClick, hoverable = true }) {
  return (
    <div 
      className={`border rounded-lg p-4 bg-white ${hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={{ borderColor: '#00ff00' }}
    >
      {children}
    </div>
  );
}

export default Card;