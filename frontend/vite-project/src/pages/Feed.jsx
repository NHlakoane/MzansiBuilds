import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Feed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await api.get('/projects');
    setProjects(res.data);
    setLoading(false);
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#00ff00', textAlign: 'center' }}>Live Feed</h1>
      <p style={{ textAlign: 'center', color: '#fff' }}>What developers are building right now</p>
      
      {projects.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>No projects yet. Be the first to build in public!</p>
      ) : (
        projects.map(project => (
          <div key={project.id} style={{ backgroundColor: '#111', padding: '15px', margin: '15px auto', maxWidth: '800px', borderRadius: '8px', border: '1px solid #00ff00' }}>
            <h3 style={{ color: '#00ff00' }}>{project.title}</h3>
            <p>{project.description}</p>
            <p><strong>By:</strong> {project.username}</p>
            <p><strong>Stage:</strong> {project.stage}</p>
            {project.is_completed && <span style={{ color: '#00ff00' }}>🎉 Completed! 🎉</span>}
            <Link to={`/project/${project.id}`} style={{ color: '#00ff00', display: 'inline-block', marginTop: '10px' }}>View Details →</Link>
          </div>
        ))
      )}
    </div>
  );
}