const pool = require('./index');

class Comment {
  static async create(projectId, userId, { content, isCollaborationRequest = false }) {
    const result = await pool.query(
      `INSERT INTO comments (project_id, user_id, content, is_collaboration_request) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [projectId, userId, content, isCollaborationRequest]
    );
    return result.rows[0];
  }

  static async findByProject(projectId) {
    const result = await pool.query(
      `SELECT c.*, u.username, u.email 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.project_id = $1 
       ORDER BY c.created_at DESC`,
      [projectId]
    );
    return result.rows;
  }

  static async findCollaborationRequests(projectId) {
    const result = await pool.query(
      `SELECT c.*, u.username, u.email 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.project_id = $1 AND c.is_collaboration_request = TRUE
       ORDER BY c.created_at DESC`,
      [projectId]
    );
    return result.rows;
  }

  static async delete(commentId, userId) {
    const result = await pool.query(
      `DELETE FROM comments 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [commentId, userId]
    );
    return result.rows[0];
  }
}

module.exports = Comment;