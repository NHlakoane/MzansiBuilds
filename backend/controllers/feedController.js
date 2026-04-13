const pool = require('../models/index');

exports.getFeed = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.username, u.email,
        (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comment_count
       FROM projects p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.username, u.email 
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};