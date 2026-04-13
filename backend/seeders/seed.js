const pool = require('../models/index');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('Seeding database...');
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userResult = await pool.query(
      `INSERT INTO users (username, email, password) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['testuser', 'test@example.com', hashedPassword]
    );
    
    let userId = 1;
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
    } else {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', ['test@example.com']);
      userId = existing.rows[0].id;
    }
    
    // Create sample projects
    await pool.query(
      `INSERT INTO projects (user_id, title, description, stage, status, support_needed)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [userId, 'MzansiBuilds Platform', 'Building in public platform for SA devs', 'in-progress', 'in-progress', 'UI/UX help']
    );
    
    await pool.query(
      `INSERT INTO projects (user_id, title, description, stage, status, support_needed)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [userId, 'E-Learning App', 'Free coding resources for South Africa', 'planning', 'planning', 'Content creators']
    );
    
    console.log('✓ Seed data inserted');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();