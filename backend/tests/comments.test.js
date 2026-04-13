const request = require('supertest');
const app = require('../server');

describe('Comments Endpoints', () => {
  let authToken;
  let projectId;
  let commentId;

  beforeEach(async () => {
    // Register user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'commentuser',
        email: 'comment@example.com',
        password: 'password123'
      });
    
    authToken = registerRes.body.token;

    // Create project
    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Project for Comments',
        description: 'Testing comments feature',
        stage: 'planning'
      });
    
    projectId = projectRes.body.id;
  });

  describe('POST /api/comments/:projectId/comments', () => {
    it('should add a comment to a project', async () => {
      const res = await request(app)
        .post(`/api/comments/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test comment'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('content', 'This is a test comment');
      expect(res.body.is_collaboration_request).toBe(false);
      commentId = res.body.id;
    });

    it('should return 400 if content is empty', async () => {
      const res = await request(app)
        .post(`/api/comments/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: ''
        });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/comments/:projectId/raise-hand', () => {
    it('should create a collaboration request', async () => {
      const res = await request(app)
        .post(`/api/comments/${projectId}/raise-hand`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.is_collaboration_request).toBe(true);
      expect(res.body.content).toContain('wants to collaborate');
    });
  });

  describe('GET /api/comments/:projectId/comments', () => {
    beforeEach(async () => {
      await request(app)
        .post(`/api/comments/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'First comment' });
      
      await request(app)
        .post(`/api/comments/${projectId}/raise-hand`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('should get all comments for a project', async () => {
      const res = await request(app)
        .get(`/api/comments/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should include user info with comments', async () => {
      const res = await request(app)
        .get(`/api/comments/${projectId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.body[0]).toHaveProperty('username');
      expect(res.body[0].username).toBe('commentuser');
    });
  });
});