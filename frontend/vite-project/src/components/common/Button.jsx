import React from 'react';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  className = ''
}) {
  const variants = {
    primary: {
      backgroundColor: '#00aa00',
      color: 'white',
      border: 'none'
    },
    secondary: {
      backgroundColor: 'black',
      color: '#00ff00',
      border: '1px solid #00ff00'
    },
    danger: {
      backgroundColor: '#dc2626',
      color: 'white'
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-medium ${className}`}
      style={variants[variant]}
    >
      {children}
    </button>
  );
}

export default Button;