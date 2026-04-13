const Project = require('../models/Project');

// @desc    Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, stage, support_needed, github_repo, live_demo } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const project = await Project.create({
      user_id: req.user.id,
      title,
      description,
      stage,
      support_needed,
      github_repo,
      live_demo
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all projects (feed)
const getAllProjects = async (req, res) => {
  console.log("getAllProjects was called");  
  try {
    const projects = await Project.getAll({});
    res.json(projects);
  } catch (error) {
    console.log("ERROR in getAllProjects:", error);  
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my projects
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.findByUserId(req.user.id);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.user_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updated = await Project.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Complete project
const completeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.user_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const completed = await Project.complete(req.params.id);
    res.json(completed);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Celebration Wall
const getCelebrationWall = async (req, res) => {
  try {
    const projects = await Project.getCelebrationWall({});
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.user_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Project.delete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  updateProject,
  completeProject,
  getCelebrationWall,
  deleteProject
};