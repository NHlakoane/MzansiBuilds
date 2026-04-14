import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      backgroundColor: '#000000', 
      padding: '1rem 2rem',
      borderBottom: '1px solid #00ff00',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <Link to="/" style={{ 
          color: '#00ff00', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          textDecoration: 'none',
          textShadow: '0 0 10px rgba(0,255,0,0.3)'
        }}>
          MzansiBuilds
        </Link>
        
        {user ? (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{ 
              color: '#ffffff', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}>
              Dashboard
            </Link>
            <Link to="/feed" style={{ 
              color: '#ffffff', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>
              Feed
            </Link>
            <Link to="/celebration" style={{ 
              color: '#ffffff', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>
              Celebration Wall
            </Link>
            <Link to="/profile" style={{ 
              color: '#ffffff', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>
              Profile
            </Link>
            <span style={{ color: '#00ff00', fontSize: '0.9rem' }}>
              Hello, {user.username || user.email}!
            </span>
            <button 
              onClick={handleLogout} 
              style={{ 
                backgroundColor: '#00ff00', 
                color: '#000000', 
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ 
            backgroundColor: '#00ff00', 
            color: '#000000', 
            padding: '0.5rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;