import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/projects/my-projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchMyProjects(); // Refresh the list
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const handleEdit = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0a1a0a 0%, #000000 100%)',
        border: '1px solid #00ff00',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#00ff00', marginBottom: '0.5rem' }}>
          Welcome back, {user?.username || user?.email}!
        </h1>
        <p style={{ color: '#cccccc' }}>Track your projects, celebrate milestones, and build in public.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <Link to="/new-project" style={{
          backgroundColor: '#00ff00',
          color: '#000000',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}>
          + New Project
        </Link>
        <Link to="/feed" style={{
          backgroundColor: 'transparent',
          color: '#00ff00',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          textDecoration: 'none',
          border: '2px solid #00ff00'
        }}>
          View All Projects
        </Link>
      </div>

      <h2 style={{ color: '#00ff00', marginBottom: '1rem', fontSize: '1.5rem' }}>📁 My Projects</h2>
      
      {loading ? (
        <p style={{ color: '#ffffff', textAlign: 'center' }}>Loading your projects...</p>
      ) : projects.length === 0 ? (
        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px dashed #00ff00',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#cccccc', marginBottom: '1rem' }}>No projects yet.</p>
          <Link to="/new-project" style={{ color: '#00ff00', textDecoration: 'underline' }}>
            Click "New Project" to start building in public!
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => (
            <div key={project.id} style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #00ff00',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#00ff00', marginBottom: '0.5rem' }}>{project.title}</h3>
              <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
                {project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description}
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  backgroundColor: project.stage === 'completed' ? '#00ff00' : '#333',
                  color: project.stage === 'completed' ? '#000' : '#00ff00',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }}>
                  {project.stage || 'planning'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link to={`/project/${project.id}`} style={{
                  color: '#00ff00',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '0.25rem 0.5rem'
                }}>
                  View Details →
                </Link>
                <button onClick={() => handleEdit(project.id)} style={{
                  backgroundColor: 'transparent',
                  color: '#00ff00',
                  border: '1px solid #00ff00',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id)} style={{
                  backgroundColor: 'transparent',
                  color: '#ff4444',
                  border: '1px solid #ff4444',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;