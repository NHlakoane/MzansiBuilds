import React, { useState, useEffect } from 'react';

function CelebrationWall() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      const token = localStorage.getItem('token');
      try {
        // Get all projects from feed
        const response = await fetch('http://localhost:5000/api/projects/feed', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const allProjects = await response.json();
          // Filter projects where stage is 'completed'
          const completed = allProjects.filter(p => p.stage === 'completed');
          setProjects(completed);
          console.log('Completed projects found:', completed.length);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompletedProjects();
  }, []);

  if (loading) {
    return <div style={{ color: '#ffffff', textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#00ff00', textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.5rem' }}>
        🎉 Celebration Wall 🎉
      </h1>
      <p style={{ color: '#cccccc', textAlign: 'center', marginBottom: '2rem' }}>
        Celebrating completed projects from the MzansiBuilds community
      </p>
      
      {projects.length === 0 ? (
        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px dashed #00ff00',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#cccccc', marginBottom: '1rem' }}>No completed projects yet.</p>
          <p style={{ color: '#666666', fontSize: '0.9rem' }}>
            To add a project to the Celebration Wall:
          </p>
          <ol style={{ color: '#666666', textAlign: 'left', maxWidth: '400px', margin: '1rem auto' }}>
            <li>1. Go to Dashboard</li>
            <li>2. Click "Edit" on your project</li>
            <li>3. Change Stage to "Completed"</li>
            <li>4. Save the project</li>
          </ol>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => (
            <div key={project.id} style={{
              backgroundColor: '#0a0a0a',
              border: '2px solid #00ff00',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
              <h3 style={{ color: '#00ff00', marginBottom: '0.5rem' }}>{project.title}</h3>
              <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
                {project.description && project.description.length > 150 
                  ? project.description.substring(0, 150) + '...' 
                  : project.description}
              </p>
              <p style={{ color: '#ffffff', fontSize: '0.9rem' }}>
                Built by: <span style={{ color: '#00ff00' }}>{project.username || project.email || 'Anonymous'}</span>
              </p>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{
                  backgroundColor: '#00ff00',
                  color: '#000000',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  COMPLETED ✓
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CelebrationWall;