const pool = require('../models/index');

// Get all completed projects for celebration wall
exports.getCelebrationWall = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.username, u.email 
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.status = 'completed'
       ORDER BY p.updated_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get celebration wall error:', error);
    res.status(500).json({ error: 'Server error while fetching celebration wall' });
  }
};

// Get count of completed projects
exports.getCompletedProjectsCount = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) FROM projects WHERE status = $1',
      ['completed']
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get completed count error:', error);
    res.status(500).json({ error: 'Server error while fetching count' });
  }
};