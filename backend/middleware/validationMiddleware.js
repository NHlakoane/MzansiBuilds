const validateProject = (req, res, next) => {
  const { title, description } = req.body;
  
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title is required and must be at least 3 characters' });
  }
  
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: 'Description is required and must be at least 10 characters' });
  }
  
  next();
};

const validateMilestone = (req, res, next) => {
  const { title } = req.body;
  
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Milestone title is required' });
  }
  
  next();
};

const validateComment = (req, res, next) => {
  const { content } = req.body;
  
  if (!content || content.trim().length < 1) {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }
  
  next();
};

module.exports = { validateProject, validateMilestone, validateComment };