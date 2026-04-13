const pool = require('../models/index');

class ProjectService {
  // Get all projects for a user
  static async getUserProjects(userId) {
    const result = await pool.query(
      `SELECT * FROM projects 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // Get a single project by ID with owner info
  static async getProjectById(projectId) {
    const result = await pool.query(
      `SELECT p.*, u.username, u.email 
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [projectId]
    );
    return result.rows[0];
  }

  // Create a new project
  static async createProject(userId, { title, description, stage, support_needed }) {
    const result = await pool.query(
      `INSERT INTO projects (user_id, title, description, stage, support_needed, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, title, description, stage || 'planning', support_needed, 'planning']
    );
    return result.rows[0];
  }

  // Update project details
  static async updateProject(projectId, { title, description, stage, support_needed }) {
    const result = await pool.query(
      `UPDATE projects 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           stage = COALESCE($3, stage),
           support_needed = COALESCE($4, support_needed),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [title, description, stage, support_needed, projectId]
    );
    return result.rows[0];
  }

  // Update project status
  static async updateProjectStatus(projectId, newStatus) {
    const result = await pool.query(
      `UPDATE projects 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [newStatus, projectId]
    );
    return result.rows[0];
  }
  
  // Check if all milestones for a project are completed
  static async checkAllMilestonesCompleted(projectId) {
    const result = await pool.query(
      `SELECT COUNT(*) as total, 
              SUM(CASE WHEN achieved THEN 1 ELSE 0 END) as completed
       FROM milestones 
       WHERE project_id = $1`,
      [projectId]
    );
    
    const { total, completed } = result.rows[0];
    return total > 0 && parseInt(completed) === parseInt(total);
  }
  
  // Auto-update project status when all milestones are completed
  static async autoUpdateProjectStatus(projectId) {
    const allCompleted = await this.checkAllMilestonesCompleted(projectId);
    
    if (allCompleted) {
      return await this.updateProjectStatus(projectId, 'completed');
    }
    return null;
  }

  // Get all projects for feed (with comment counts)
  static async getFeed() {
    const result = await pool.query(
      `SELECT p.*, u.username, u.email,
              (SELECT COUNT(*) FROM comments WHERE project_id = p.id) as comment_count,
              (SELECT COUNT(*) FROM milestones WHERE project_id = p.id AND achieved = true) as completed_milestones,
              (SELECT COUNT(*) FROM milestones WHERE project_id = p.id) as total_milestones
       FROM projects p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  // Delete a project
  static async deleteProject(projectId, userId) {
    const result = await pool.query(
      `DELETE FROM projects 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [projectId, userId]
    );
    return result.rows[0];
  }
}

module.exports = ProjectService;