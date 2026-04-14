import React from 'react';
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '2rem auto', 
      padding: '2rem',
      backgroundColor: '#0a0a0a',
      borderRadius: '12px',
      border: '1px solid #00ff00',
      textAlign: 'center'
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        backgroundColor: '#00ff00',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem'
      }}>
        👨‍💻
      </div>
      
      <h1 style={{ color: '#00ff00', marginBottom: '1.5rem' }}>Your Profile</h1>
      
      {user && (
        <div style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#00ff00' }}>Username:</strong>
            <p style={{ color: '#ffffff', marginTop: '0.25rem' }}>{user.username}</p>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#00ff00' }}>Email:</strong>
            <p style={{ color: '#ffffff', marginTop: '0.25rem' }}>{user.email}</p>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#00ff00' }}>Full Name:</strong>
            <p style={{ color: '#ffffff', marginTop: '0.25rem' }}>{user.full_name || 'Not provided'}</p>
          </div>
          
          <div>
            <strong style={{ color: '#00ff00' }}>Member Since:</strong>
            <p style={{ color: '#ffffff', marginTop: '0.25rem' }}>
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;