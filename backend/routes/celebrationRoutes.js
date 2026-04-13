const express = require('express');
const router = express.Router();
const { getCelebrationWall, getCompletedProjectsCount } = require('../controllers/celebrationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCelebrationWall);
router.get('/count', protect, getCompletedProjectsCount);

module.exports = router;