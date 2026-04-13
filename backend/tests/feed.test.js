const request = require('supertest');
const app = require('../server');
const pool = require('../models/index');

describe('Feed Endpoints', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Create test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'feeduser',
        email: 'feed@example.com',
        password: 'password123'
      });
    
    authToken = registerRes.body.token;
    testUser = registerRes.body;

    // Create multiple projects
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Feed Project 1',
        description: 'First project for feed',
        stage: 'in-progress'
      });
    
    await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Feed Project 2',
        description: 'Second project for feed',
        stage: 'planning'
      });
  });

  describe('GET /api/projects/feed', () => {
    it('should return all projects in descending order', async () => {
      const res = await request(app)
        .get('/api/projects/feed')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      // Should be sorted by created_at DESC
      expect(new Date(res.body[0].created_at).getTime())
        .toBeGreaterThanOrEqual(new Date(res.body[1].created_at).getTime());
    });

    it('should include user information with each project', async () => {
      const res = await request(app)
        .get('/api/projects/feed')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.body[0]).toHaveProperty('username');
      expect(res.body[0]).toHaveProperty('email');
      expect(res.body[0].username).toBe('feeduser');
    });

    it('should include milestone counts', async () => {
      const res = await request(app)
        .get('/api/projects/feed')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.body[0]).toHaveProperty('total_milestones');
      expect(res.body[0]).toHaveProperty('completed_milestones');
    });
  });

  describe('Project filtering and sorting', () => {
    it('should return projects with different stages', async () => {
      const res = await request(app)
        .get('/api/projects/feed')
        .set('Authorization', `Bearer ${authToken}`);
      
      const stages = res.body.map(p => p.stage);
      expect(stages).toContain('in-progress');
      expect(stages).toContain('planning');
    });
  });
});