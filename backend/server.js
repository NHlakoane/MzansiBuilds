const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');  
const milestoneRoutes = require('./routes/milestoneRoutes');
const commentRoutes = require('./routes/commentRoutes');
const celebrationRoutes = require('./routes/celebrationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (MUST come before routes)
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);  
app.use('/api/milestones', milestoneRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/celebration', celebrationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MzansiBuilds API is running!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: process.env.DB_NAME,
    user: process.env.DB_USER
  });
});

// Error handling middleware (MUST be after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server - ONLY ONCE
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}`);
  console.log(`👤 User: ${process.env.DB_USER}`);
});

// Export app for testing
module.exports = app;