const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  updateProject,
  completeProject,
  getCelebrationWall,
  deleteProject
} = require('../controllers/projectController');

const router = express.Router();

// Public routes (anyone can access)
router.get('/', getAllProjects);                           // Feed - all projects
router.get('/celebration/wall', getCelebrationWall);       // Celebration Wall
router.get('/:id', getProjectById);                        // Single project details

// Protected routes (require login token)
router.post('/', protect, createProject);                  // Create new project
router.get('/my/projects', protect, getMyProjects);        // Get logged-in user's projects
router.put('/:id', protect, updateProject);                // Update project
router.put('/:id/complete', protect, completeProject);     // Mark project as complete
router.delete('/:id', protect, deleteProject);             // Delete project

module.exports = router;