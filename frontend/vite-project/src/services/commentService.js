// This is optional since projectService already has comment methods
// But if you want a dedicated service:

import { authFetch } from './projectService';

export const getComments = async (projectId) => {
  return authFetch(`/comments/${projectId}/comments`);
};

export const addComment = async (projectId, content) => {
  return authFetch(`/comments/${projectId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

export const raiseHand = async (projectId) => {
  return authFetch(`/comments/${projectId}/raise-hand`, {
    method: 'POST',
  });
};