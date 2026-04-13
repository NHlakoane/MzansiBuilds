const Milestone = require('../models/Milestone');

// Create a new milestone
exports.createMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;
    
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Title is required and must be at least 3 characters' });
    }
    
    const milestone = await Milestone.create(projectId, { title, description });
    res.status(201).json(milestone);
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({ error: 'Server error while creating milestone' });
  }
};

// Get all milestones for a project
exports.getProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestones = await Milestone.findByProject(projectId);
    res.json(milestones);
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({ error: 'Server error while fetching milestones' });
  }
};

// Mark a milestone as achieved
exports.markMilestoneAchieved = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const milestone = await Milestone.markAchieved(milestoneId, projectId);
    
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    res.json(milestone);
  } catch (error) {
    console.error('Mark milestone error:', error);
    res.status(500).json({ error: 'Server error while updating milestone' });
  }
};