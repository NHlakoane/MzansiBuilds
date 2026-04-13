import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: 'black', color: 'white', padding: '1rem' }}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold" style={{ color: '#00ff00' }}>
          MzansiBuilds
        </Link>
        
        {user && (
          <div className="flex gap-6 items-center">
            <Link to="/feed" className="hover:text-green-400">Feed</Link>
            <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
            <Link to="/celebration" className="hover:text-green-400">🎉 Wall of Fame</Link>
            <div className="flex items-center gap-3">
              <span className="text-sm">Hello, {user.username || user.email}</span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1 rounded"
                style={{ backgroundColor: '#00ff00', color: 'black' }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;