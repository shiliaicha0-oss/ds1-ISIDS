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
// ken user connecté (authenticateToken)
// validateStatus ychouf statut ken valid (todo/doing/done)
router.post('/', authenticateToken, validateStatus, createTask);

// GET MY TASKS
// yjib barcha taches li user houwa owner fil projet wela assignTo
router.get('/my', authenticateToken, getMyTasks);

// GET ALL TASKS (manager)
// manager bark ynajem ychouf les taches
router.get('/all', authenticateToken, isManager, getAllTasks);

// GET ONE
// propriétaire mta3 projet, user assigné wala manager ynajem ychouf tâche
router.get('/:id', authenticateToken, getTaskById);

// UPDATE (owner or manager)
// propriétaire mta3 projet wela manager ynajem ybadel

router.put('/:id', authenticateToken, validateStatus, updateTask);

// ASSIGN TASK (manager only)
// manager ynajem y3ayen tâche ll user
router.patch('/:id/assign', authenticateToken, isManager, assignTask);

// DELETE
// manager wala propriétaire mta3 projet ynajem ysameha
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
