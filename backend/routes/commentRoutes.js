const express = require('express');
const router = express.Router();
const { 
  addComment, 
  getProjectComments, 
  raiseHand 
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Routes
router.post('/:projectId/comments', addComment);
router.get('/:projectId/comments', getProjectComments);
router.post('/:projectId/raise-hand', raiseHand);

module.exports = router;