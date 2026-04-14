import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
    fetchComments();
  }, [id]);

  // Fetch comments for this project
  const fetchComments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (response.ok) {
        setNewComment('');
        fetchComments(); // Refresh comments
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Raise hand for collaboration
  const raiseHand = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}/raise-hand`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('🤝 Collaboration request sent! The project owner will be notified.');
        fetchComments(); // Refresh to show the collaboration request
      } else {
        alert('Failed to send collaboration request');
      }
    } catch (error) {
      console.error('Error raising hand:', error);
      alert('Error sending request');
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>Loading project...</div>;
  if (error) return <div style={{ color: '#ff4444', textAlign: 'center', padding: '2rem' }}>Error: {error}</div>;
  if (!project) return <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>Project not found</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {/* Project Details Card */}
      <div style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid #00ff00',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ color: '#00ff00', marginBottom: '0.5rem' }}>{project.title}</h1>
        
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            backgroundColor: project.stage === 'completed' ? '#00ff00' : '#333',
            color: project.stage === 'completed' ? '#000' : '#00ff00',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.85rem'
          }}>
            {project.stage || 'planning'}
          </span>
        </div>
        
        <p style={{ color: '#ccc', marginBottom: '1rem', lineHeight: '1.6' }}>
          {project.description}
        </p>
        
        {project.support_needed && (
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <strong style={{ color: '#00ff00' }}>Support Needed:</strong>
            <p style={{ color: '#ccc', marginTop: '0.5rem' }}>{project.support_needed}</p>
          </div>
        )}
        
        <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '1rem' }}>
          <p>Built by: <span style={{ color: '#00ff00' }}>{project.username || project.email}</span></p>
          <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
        </div>

        {/* Raise Hand Button */}
        {user && user.id !== project.user_id && (
          <button
            onClick={raiseHand}
            style={{
              backgroundColor: '#00ff00',
              color: '#000',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '1rem',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            🤝 Raise Hand to Collaborate
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <h2 style={{ color: '#00ff00', marginBottom: '1.5rem' }}>
          💬 Comments & Collaboration Requests ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user && (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ask a question, give feedback, or offer help..."
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                marginBottom: '0.5rem',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              style={{
                backgroundColor: '#00ff00',
                color: '#000',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                opacity: submitting || !newComment.trim() ? 0.5 : 1
              }}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
            No comments yet. Be the first to interact!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map(comment => (
              <div
                key={comment.id}
                style={{
                  backgroundColor: comment.is_collaboration_request ? '#1a2a1a' : '#111',
                  border: comment.is_collaboration_request ? '1px solid #00ff00' : '1px solid #333',
                  borderRadius: '8px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#00ff00' }}>
                    {comment.username || comment.email}
                    {comment.is_collaboration_request && ' 🤝 wants to collaborate!'}
                  </strong>
                  <span style={{ color: '#666', fontSize: '0.8rem' }}>
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p style={{ color: '#ccc', margin: 0 }}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;