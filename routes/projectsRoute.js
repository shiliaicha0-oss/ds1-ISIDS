const express = require('express');
const router = express.Router();

const {
  createProject,
  getMyProjects,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const { authenticateToken, isManager } = require('../middlewares/authMiddleware');

// CREATE PROJECT (user + manager)
router.post('/', authenticateToken, createProject);

// GET MY PROJECTS (user + manager)
router.get('/my', authenticateToken, getMyProjects);

// GET ALL PROJECTS (manager uniquement)
router.get('/all', authenticateToken, isManager, getAllProjects);

// GET ONE PROJECT (manager ou owner)
router.get('/:id', authenticateToken, getProjectById);

// UPDATE PROJECT (manager ou owner)
router.put('/:id', authenticateToken, updateProject);

// DELETE PROJECT (manager ou owner)
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;
