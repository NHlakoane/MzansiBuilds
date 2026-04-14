import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function EditProject() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'planning',
    support_needed: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          stage: data.stage || 'planning',
          support_needed: data.support_needed || ''
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update project');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return <div style={{ color: '#ffffff', textAlign: 'center', padding: '2rem' }}>Loading project...</div>;
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
      <h1 style={{ color: '#00ff00', marginBottom: '1.5rem' }}>Edit Project</h1>
      
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
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#00ff00',
              color: '#000000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'transparent',
              color: '#00ff00',
              fontWeight: 'bold',
              border: '1px solid #00ff00',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProject;