const pool = require('../config/db');

class Project {
  // Create a new project
  static async create({ user_id, title, description, stage, support_needed, github_repo, live_demo }) {
    const query = `
      INSERT INTO projects (user_id, title, description, stage, support_needed, github_repo, live_demo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [user_id, title, description, stage || 'planning', support_needed, github_repo, live_demo];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get project by ID with user info
  static async findById(id) {
    const query = `
      SELECT p.*, u.username, u.email, u.full_name, u.avatar_url,
             (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comment_count,
             (SELECT COUNT(*) FROM milestones WHERE project_id = p.id) as total_milestones,
             (SELECT COUNT(*) FROM milestones WHERE project_id = p.id AND achieved = true) as completed_milestones
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
      GROUP BY p.id, u.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get all projects (feed) with user info and counts
  static async getAll({ limit = 20, offset = 0, stage = null, includeCompleted = true }) {
    let query = `
      SELECT p.*, u.username, u.email, u.full_name, u.avatar_url,
             (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comment_count,
             (SELECT COUNT(*) FROM milestones WHERE project_id = p.id) as total_milestones,
             (SELECT COUNT(*) FROM milestones WHERE project_id = p.id AND achieved = true) as completed_milestones
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let valueIndex = 1;

    if (stage && stage !== 'all') {
      query += ` AND p.stage = $${valueIndex}`;
      values.push(stage);
      valueIndex++;
    }

    if (!includeCompleted) {
      query += ` AND p.is_completed = false`;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Get user's projects
  static async findByUserId(userId) {
    const query = `
      SELECT p.*, 
             (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comment_count,
             (SELECT COUNT(*) FROM milestones WHERE project_id = p.id AND achieved = true) as completed_milestones,
             (SELECT COUNT(*) FROM milestones WHERE project_id = p.id) as total_milestones
      FROM projects p
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Update project
  static async update(id, { title, description, stage, support_needed, github_repo, live_demo }) {
    const query = `
      UPDATE projects 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          stage = COALESCE($3, stage),
          support_needed = COALESCE($4, support_needed),
          github_repo = COALESCE($5, github_repo),
          live_demo = COALESCE($6, live_demo),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [title, description, stage, support_needed, github_repo, live_demo, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Mark project as completed
  static async complete(id) {
    const query = `
      UPDATE projects 
      SET is_completed = true, 
          completed_at = CURRENT_TIMESTAMP,
          stage = 'completed'
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Delete project
  static async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get celebration wall (completed projects)
  static async getCelebrationWall({ limit = 50 }) {
    const query = `
      SELECT p.*, u.username, u.email, u.full_name, u.avatar_url,
             (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comment_count
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_completed = true
      ORDER BY p.completed_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Project;