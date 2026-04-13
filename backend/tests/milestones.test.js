const request = require('supertest');
const app = require('../server');

describe('Milestones Endpoints', () => {
  let authToken;
  let projectId;
  let milestoneId;

  beforeEach(async () => {
    // Register user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'milestoneuser',
        email: 'milestone@example.com',
        password: 'password123'
      });
    
    authToken = registerRes.body.token;

    // Create a project FIRST
    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Project with Milestones',
        description: 'Testing milestones feature',
        stage: 'in-progress'
      });
    
    projectId = projectRes.body.id;
  });

  describe('POST /api/milestones/:projectId/milestones', () => {
    it('should create a milestone for a project', async () => {
      const res = await request(app)
        .post(`/api/milestones/${projectId}/milestones`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Design Database',
          description: 'Create PostgreSQL schema'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'Design Database');
      expect(res.body).toHaveProperty('project_id', projectId);
      expect(res.body.achieved).toBe(false);
      milestoneId = res.body.id;
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post(`/api/milestones/${projectId}/milestones`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing title'
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/milestones/:projectId/milestones', () => {
    beforeEach(async () => {
      await request(app)
        .post(`/api/milestones/${projectId}/milestones`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Milestone 1', description: 'First' });
      
      const res2 = await request(app)
        .post(`/api/milestones/${projectId}/milestones`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Milestone 2', description: 'Second' });
      
      milestoneId = res2.body.id;
    });

    it('should get all milestones for a project', async () => {
      const res = await request(app)
        .get(`/api/milestones/${projectId}/milestones`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('PUT /api/milestones/:projectId/milestones/:milestoneId', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/milestones/${projectId}/milestones`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'To Complete', description: 'Will be marked done' });
      
      milestoneId = res.body.id;
    });

    it('should mark a milestone as achieved', async () => {
      const res = await request(app)
        .put(`/api/milestones/${projectId}/milestones/${milestoneId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.achieved).toBe(true);
      expect(res.body.achieved_date).toBeDefined();
    });
  });
});