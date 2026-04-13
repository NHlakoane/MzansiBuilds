const express = require('express');
const router = express.Router();
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

// Routes
router.get('/feed', protect, getAllProjects);
router.get('/celebration-wall', protect, getCelebrationWall);
router.post('/', protect, createProject);
router.get('/', protect, getAllProjects);
router.get('/my-projects', protect, getMyProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.put('/:id/complete', protect, completeProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;