import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { getCelebrationWall } from '../services/projectService';

function CelebrationWall() {
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedProjects();
  }, []);

  const loadCompletedProjects = async () => {
    try {
      const data = await getCelebrationWall();
      setCompletedProjects(data);
    } catch (error) {
      console.error('Error loading celebration wall:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading wall of fame...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#00aa00' }}>
          🎉 Celebration Wall 🎉
        </h1>
        <p className="text-gray-600">Developers who completed their projects by building in public</p>
      </div>

      {completedProjects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No completed projects yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedProjects.map(project => (
            <Card key={project.id} hoverable>
              <div className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                <p className="text-sm" style={{ color: '#00aa00' }}>
                  Built by: {project.username || project.email}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Completed: {new Date(project.updated_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default CelebrationWall;