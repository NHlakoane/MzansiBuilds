const request = require('supertest');
const app = require('../server');

describe('Projects Endpoints', () => {
  let authToken;
  let userId;
  let projectId;

  beforeEach(async () => {
    // Register and login a test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'projectuser',
        email: 'project@example.com',
        password: 'password123'
      });
    
    authToken = registerRes.body.token;
    userId = registerRes.body.id;
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Project',
          description: 'This is a test project description',
          stage: 'in-progress',
          support_needed: 'Frontend help'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Project');
      expect(res.body).toHaveProperty('user_id', userId);
      projectId = res.body.id;
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing title'
        });
      
      expect(res.statusCode).toBe(400);
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          title: 'Unauthorized Project',
          description: 'Should not create'
        });
      
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/projects/feed', () => {
    beforeEach(async () => {
      // Create a test project
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Feed Project',
          description: 'Project for feed testing',
          stage: 'planning'
        });
      projectId = createRes.body.id;
    });

    it('should get all projects in feed', async () => {
      const res = await request(app)
        .get('/api/projects/feed')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should include comment counts in feed', async () => {
      const res = await request(app)
        .get('/api/projects/feed')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.body[0]).toHaveProperty('comment_count');
      expect(res.body[0]).toHaveProperty('completed_milestones');
    });
  });

  describe('GET /api/projects/:id', () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Single Project',
          description: 'Get by ID test',
          stage: 'in-progress'
        });
      projectId = createRes.body.id;
    });

    it('should get a single project by ID', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', projectId);
      expect(res.body).toHaveProperty('title', 'Single Project');
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/projects/:id', () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          description: 'Original description',
          stage: 'planning'
        });
      projectId = createRes.body.id;
    });

    it('should update a project', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          stage: 'completed'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.stage).toBe('completed');
    });

    it('should not update project of another user', async () => {
      // Create second user
      const secondUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'seconduser',
          email: 'second@example.com',
          password: 'password123'
        });
      const secondToken = secondUserRes.body.token;
      
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${secondToken}`)
        .send({
          title: 'Hacked Title'
        });
      
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To Delete',
          description: 'This project will be deleted',
          stage: 'planning'
        });
      projectId = createRes.body.id;
    });

    it('should delete a project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Project deleted successfully');
      
      // Verify it's gone
      const getRes = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(getRes.statusCode).toBe(404);
    });
  });
});