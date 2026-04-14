import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NewProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'planning',
    support_needed: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to create project');
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '2rem',
      backgroundColor: '#0a0a0a',
      borderRadius: '12px',
      border: '1px solid #00ff00'
    }}>
      <h1 style={{ color: '#00ff00', marginBottom: '1.5rem' }}>Create New Project</h1>
      
      {error && <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Project Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#ffffff'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#ffffff'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Stage</label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#ffffff'
            }}
          >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Support Needed</label>
          <textarea
            name="support_needed"
            value={formData.support_needed}
            onChange={handleChange}
            rows="3"
            placeholder="What kind of help do you need? (UI/UX, Backend, Testing, etc.)"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#ffffff'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#00ff00',
            color: '#000000',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default NewProject;