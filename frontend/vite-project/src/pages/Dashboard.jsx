import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', stage: 'planning' });

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    const res = await api.get('/projects/my/projects');
    setProjects(res.data);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await api.post('/projects', newProject);
    setNewProject({ title: '', description: '', stage: 'planning' });
    setShowForm(false);
    fetchProjects();
  };

  const handleComplete = async (id) => {
    await api.put(`/projects/${id}/complete`);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #00ff00', paddingBottom: '10px' }}>
        <h1 style={{ color: '#00ff00' }}>MzansiBuilds</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Hello, {user.username}</span>
          <button onClick={logout} style={{ backgroundColor: '#333', color: '#fff', padding: '5px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>My Projects</h2>
          <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#00ff00', color: '#000', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + New Project
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateProject} style={{ backgroundColor: '#111', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#222', color: '#fff', border: '1px solid #00ff00', borderRadius: '4px' }}
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#222', color: '#fff', border: '1px solid #00ff00', borderRadius: '4px' }}
            />
            <select
              value={newProject.stage}
              onChange={(e) => setNewProject({ ...newProject, stage: e.target.value })}
              style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#222', color: '#fff', border: '1px solid #00ff00', borderRadius: '4px' }}
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
            </select>
            <button type="submit" style={{ backgroundColor: '#00ff00', color: '#000', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Create Project</button>
          </form>
        )}

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>No projects yet. Click "New Project" to start building in public!</p>
        ) : (
          projects.map(project => (
            <div key={project.id} style={{ backgroundColor: '#111', padding: '15px', margin: '15px 0', borderRadius: '8px', border: '1px solid #00ff00' }}>
              <h3 style={{ color: '#00ff00' }}>{project.title}</h3>
              <p>{project.description}</p>
              <p><strong>Stage:</strong> {project.stage}</p>
              {!project.is_completed && (
                <button onClick={() => handleComplete(project.id)} style={{ backgroundColor: '#00ff00', color: '#000', padding: '5px 10px', marginRight: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Mark Complete
                </button>
              )}
              {project.is_completed && <span style={{ color: '#00ff00' }}>✅ Completed!</span>}
              <button onClick={() => handleDelete(project.id)} style={{ backgroundColor: '#ff4444', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}