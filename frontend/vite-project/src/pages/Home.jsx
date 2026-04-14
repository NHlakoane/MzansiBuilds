import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const { user } = useAuth();

  return (
    <div style={{ 
      minHeight: '80vh', 
      background: 'linear-gradient(135deg, #000000 0%, #0a1a0a 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        color: '#00ff00', 
        fontSize: '3.5rem', 
        marginBottom: '1rem',
        textShadow: '0 0 20px rgba(0,255,0,0.3)'
      }}>
        MzansiBuilds
      </h1>
      <p style={{ 
        color: '#cccccc', 
        fontSize: '1.2rem', 
        maxWidth: '600px',
        marginBottom: '2rem'
      }}>
        Building in public for South African developers. Share your projects, get feedback, and celebrate your wins.
      </p>
      
      {!user ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{
            backgroundColor: '#00ff00',
            color: '#000000',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'transform 0.2s'
          }}>
            Get Started
          </Link>
          <Link to="/feed" style={{
            backgroundColor: 'transparent',
            color: '#00ff00',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            border: '2px solid #00ff00'
          }}>
            View Feed
          </Link>
        </div>
      ) : (
        <Link to="/dashboard" style={{
          backgroundColor: '#00ff00',
          color: '#000000',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}>
          Go to Dashboard
        </Link>
      )}
    </div>
  );
}

export default Home;