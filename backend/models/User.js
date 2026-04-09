const pool = require('../config/db');

class User {
  // Creates a new user in the database
  static async create({ username, email, password_hash, full_name, bio }) {
    const query = `
      INSERT INTO users (username, email, password_hash, full_name, bio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, full_name, bio, created_at
    `;
    const values = [username, email, password_hash, full_name || null, bio || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Finds a user by their email address (used for login)
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Finds a user by their username (used to check if username is taken)
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  // Finds a user by their ID (used to get profile info)
  static async findById(id) {
    const query = 'SELECT id, username, email, full_name, bio, avatar_url, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Updates a user's profile information
  static async update(id, { full_name, bio, avatar_url }) {
    const query = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          bio = COALESCE($2, bio),
          avatar_url = COALESCE($3, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, username, email, full_name, bio, avatar_url
    `;
    const values = [full_name, bio, avatar_url, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;