const Comment = require('../models/Comment');

// Add a comment to a project
exports.addComment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { content, isCollaborationRequest } = req.body;
    
    if (!content || content.trim().length < 1) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    const comment = await Comment.create(projectId, userId, { 
      content, 
      isCollaborationRequest: isCollaborationRequest || false 
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error while adding comment' });
  }
};

// Get all comments for a project
exports.getProjectComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const comments = await Comment.findByProject(projectId);
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error while fetching comments' });
  }
};

// Raise hand for collaboration
exports.raiseHand = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const username = req.user.username || 'Someone';
    const content = `${username} wants to collaborate on this project! 🤝`;
    
    const comment = await Comment.create(projectId, userId, { 
      content, 
      isCollaborationRequest: true 
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Raise hand error:', error);
    res.status(500).json({ error: 'Server error while raising hand' });
  }
};