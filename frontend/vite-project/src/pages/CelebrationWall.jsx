import React, { useState, useEffect } from 'react';
import { getCelebrationWall } from '../services/projectService';

function CelebrationWall() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getCelebrationWall();
      setProjects(data);
    } catch (error) {
      console.error('Error loading celebration wall:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#00aa00' }}>
        🎉 Celebration Wall 🎉
      </h1>
      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No completed projects yet. Be the first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="border rounded-lg p-4 shadow">
              <h3 className="font-bold text-lg">{project.title}</h3>
              <p className="text-gray-600 text-sm">{project.description}</p>
              <p className="text-sm mt-2" style={{ color: '#00aa00' }}>
                Built by: {project.username || project.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CelebrationWall;