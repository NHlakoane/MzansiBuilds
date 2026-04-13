const express = require('express');
const router = express.Router();
const { 
  createMilestone, 
  getProjectMilestones, 
  markMilestoneAchieved 
} = require('../controllers/milestoneController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Routes
router.post('/:projectId/milestones', createMilestone);
router.get('/:projectId/milestones', getProjectMilestones);
router.put('/:projectId/milestones/:milestoneId', markMilestoneAchieved);

module.exports = router;