const API_URL = 'http://localhost:5000/api';

// Helper function for authenticated requests
const authFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

// ============ PROJECT CRUD ============

// Get all projects for feed
export const getFeed = async () => {
  return authFetch('/projects/feed');
};

// Get single project by ID
export const getProjectById = async (projectId) => {
  return authFetch(`/projects/${projectId}`);
};

// Get current user's projects
export const getUserProjects = async () => {
  return authFetch('/projects/my-projects');
};

// Create new project
export const createProject = async (projectData) => {
  return authFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
};

// Update project
export const updateProject = async (projectId, projectData) => {
  return authFetch(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
};

// Delete project
export const deleteProject = async (projectId) => {
  return authFetch(`/projects/${projectId}`, {
    method: 'DELETE',
  });
};

// ============ MILESTONES ============

// Get milestones for a project
export const getMilestones = async (projectId) => {
  return authFetch(`/milestones/${projectId}/milestones`);
};

// Create milestone
export const createMilestone = async (projectId, milestoneData) => {
  return authFetch(`/milestones/${projectId}/milestones`, {
    method: 'POST',
    body: JSON.stringify(milestoneData),
  });
};

// Mark milestone as achieved
export const markMilestoneAchieved = async (projectId, milestoneId) => {
  return authFetch(`/milestones/${projectId}/milestones/${milestoneId}`, {
    method: 'PUT',
  });
};

// ============ COMMENTS ============

// Get comments for a project
export const getComments = async (projectId) => {
  return authFetch(`/comments/${projectId}/comments`);
};

// Add comment
export const addComment = async (projectId, commentData) => {
  return authFetch(`/comments/${projectId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
};

// Raise hand (collaboration request)
export const raiseHand = async (projectId) => {
  return authFetch(`/comments/${projectId}/raise-hand`, {
    method: 'POST',
  });
};

// ============ CELEBRATION WALL ============

// Get completed projects for celebration wall
export const getCelebrationWall = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/celebration', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Get count of completed projects
export const getCompletedCount = async () => {
  return authFetch('/celebration/count');
};

