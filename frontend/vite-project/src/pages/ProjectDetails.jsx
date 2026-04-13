import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProjectById } from '../services/projectService';
import { getMilestones, createMilestone, markMilestoneAchieved } from '../services/milestoneService';
import { getComments, addComment, raiseHand } from '../services/commentService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '' });
  const [newComment, setNewComment] = useState('');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const [projectData, milestonesData, commentsData] = await Promise.all([
        getProjectById(id),
        getMilestones(id),
        getComments(id)
      ]);
      setProject(projectData);
      setMilestones(milestonesData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    try {
      const milestone = await createMilestone(id, newMilestone);
      setMilestones([...milestones, milestone]);
      setNewMilestone({ title: '', description: '' });
      setShowMilestoneForm(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const handleMarkAchieved = async (milestoneId) => {
    try {
      const updated = await markMilestoneAchieved(id, milestoneId);
      setMilestones(milestones.map(m => m.id === milestoneId ? updated : m));
    } catch (error) {
      console.error('Error marking milestone:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await addComment(id, { content: newComment });
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleRaiseHand = async () => {
    try {
      const collabRequest = await raiseHand(id);
      setComments([collabRequest, ...comments]);
    } catch (error) {
      console.error('Error raising hand:', error);
    }
  };

  const getStageBadgeColor = (stage) => {
    switch(stage) {
      case 'planning': return 'bg-gray-500';
      case 'in-progress': return 'bg-green-500';
      case 'completed': return 'bg-black';
      default: return 'bg-gray-400';
    }
  };

  if (loading) return <div className="text-center py-10">Loading project...</div>;
  if (!project) return <div className="text-center py-10">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6" style={{ backgroundColor: 'white', color: 'black' }}>
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex gap-4 mb-4">
          <span className={`px-3 py-1 rounded-full text-white ${getStageBadgeColor(project.stage)}`}>
            {project.stage}
          </span>
          {project.support_needed && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
              Needs: {project.support_needed}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">By: {project.username || project.user_email}</p>
      </div>

      {/* Milestones Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold" style={{ color: '#00aa00' }}>Milestones</h2>
          <Button onClick={() => setShowMilestoneForm(!showMilestoneForm)}>
            + Add Milestone
          </Button>
        </div>

        {showMilestoneForm && (
          <form onSubmit={handleAddMilestone} className="mb-4 p-4 border rounded-lg">
            <input
              type="text"
              placeholder="Milestone title"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <Button type="submit">Save Milestone</Button>
          </form>
        )}

        {milestones.length === 0 ? (
          <p className="text-gray-500">No milestones yet. Add one to track progress!</p>
        ) : (
          <ul className="space-y-2">
            {milestones.map(milestone => (
              <li key={milestone.id} className="flex items-center gap-3 p-3 border rounded">
                <input
                  type="checkbox"
                  checked={milestone.achieved}
                  onChange={() => handleMarkAchieved(milestone.id)}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <span className={milestone.achieved ? 'line-through text-gray-400' : 'font-medium'}>
                    {milestone.title}
                  </span>
                  {milestone.description && (
                    <p className="text-sm text-gray-500">{milestone.description}</p>
                  )}
                </div>
                {milestone.achieved_date && (
                  <span className="text-xs text-gray-400">
                    Completed: {new Date(milestone.achieved_date).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Comments & Collaboration Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold" style={{ color: '#00aa00' }}>Comments & Collaboration</h2>
          <Button onClick={handleRaiseHand} style={{ backgroundColor: '#00aa00', color: 'white' }}>
            🤝 Raise Hand to Collaborate
          </Button>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            placeholder="Add a comment or question..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-lg"
            rows="3"
          />
          <Button type="submit" className="mt-2">Post Comment</Button>
        </form>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className={`p-3 rounded-lg border ${comment.is_collaboration_request ? 'bg-green-50 border-green-300' : 'bg-gray-50'}`}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{comment.username || comment.user_email}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
                {comment.is_collaboration_request && (
                  <span className="inline-block mt-1 text-xs text-green-600 font-medium">
                    🤝 Collaboration Request
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;