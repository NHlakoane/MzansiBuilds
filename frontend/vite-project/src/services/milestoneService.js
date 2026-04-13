import api from './api'; // assuming you have an axios instance

export const getMilestones = async (projectId) => {
  const response = await api.get(`/milestones/${projectId}/milestones`);
  return response.data;
};

export const createMilestone = async (projectId, data) => {
  const response = await api.post(`/milestones/${projectId}/milestones`, data);
  return response.data;
};

export const markMilestoneAchieved = async (projectId, milestoneId) => {
  const response = await api.put(`/milestones/${projectId}/milestones/${milestoneId}`);
  return response.data;
};