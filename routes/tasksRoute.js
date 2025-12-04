const express = require('express');
const router = express.Router();

const { authenticateToken, isManager } = require('../middlewares/authMiddleware');
const validateStatus = require('../middlewares/validateTaskStatus');

const {
  createTask,
  getMyTasks,
  getAllTasks,
  getTaskById,
  updateTask,
  assignTask,
  deleteTask
} = require('../controllers/taskController');

// CREATE
router.post('/', authenticateToken, validateStatus, createTask);

// GET MY TASKS
router.get('/my', authenticateToken, getMyTasks);

// GET ALL TASKS (manager)
router.get('/all', authenticateToken, isManager, getAllTasks);

// GET ONE
router.get('/:id', authenticateToken, getTaskById);

// UPDATE (owner or manager)
router.put('/:id', authenticateToken, validateStatus, updateTask);

// ASSIGN TASK (manager only)
router.patch('/:id/assign', authenticateToken, isManager, assignTask);

// DELETE
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
