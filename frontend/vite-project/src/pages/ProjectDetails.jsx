import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Fetching project:', id);
    console.log('Token:', token);
    
    fetch(`http://localhost:5000/api/projects/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Project data:', data);
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading project...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!project) return <div className="p-6 text-center">Project not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 mb-4">{project.description}</p>
      <div className="mb-2">
        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
          Stage: {project.stage || 'planning'}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-4">Project ID: {id}</p>
      <p className="text-sm text-gray-500">Created by: {project.username || project.email}</p>
    </div>
  );
}

export default ProjectDetails;