import pool from './db.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  try {
    const sql = fs.readFileSync(join(__dirname, 'database.sql'), 'utf8');
    
    console.log('📦 Creating database schema...');
    await pool.query(sql);
    console.log('✅ Database schema created successfully!');
    
    // Optional: Seed sample data
    const seed = await import('../seeders/seed.js');
    await seed.default();
    
    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initDatabase();