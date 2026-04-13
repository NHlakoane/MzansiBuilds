const pool = require('./index');

class Milestone {
  static async create(projectId, { title, description }) {
    const result = await pool.query(
      `INSERT INTO milestones (project_id, title, description) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [projectId, title, description || null]
    );
    return result.rows[0];
  }

  static async findByProject(projectId) {
    const result = await pool.query(
      `SELECT * FROM milestones 
       WHERE project_id = $1 
       ORDER BY created_at ASC`,
      [projectId]
    );
    return result.rows;
  }

  static async markAchieved(milestoneId, projectId) {
    const result = await pool.query(
      `UPDATE milestones 
       SET achieved = TRUE, achieved_date = NOW() 
       WHERE id = $1 AND project_id = $2 
       RETURNING *`,
      [milestoneId, projectId]
    );
    return result.rows[0];
  }

  static async delete(milestoneId, projectId) {
    const result = await pool.query(
      `DELETE FROM milestones 
       WHERE id = $1 AND project_id = $2 
       RETURNING *`,
      [milestoneId, projectId]
    );
    return result.rows[0];
  }
}

module.exports = Milestone;