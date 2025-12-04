const express = require('express');
const {
  getAllUsers,    // njibo l users lkol 
  getUserById,    // njibo l user hasb l id
  deleteUser,     // nfaskho user
  updateUser,     // tbadel hajet lel user
} = require('../controllers/userController.js');
const { authenticateToken, isManager } = require('../middlewares/authMiddleware'); // Middlewares lel authentication
const router = express.Router();

// routes mta3 l users
router.get('/getAll', authenticateToken, isManager, getAllUsers); // users lkol
router.get('/:id', authenticateToken, getUserById); // user hasb l id 
router.delete('/:id', authenticateToken, isManager, deleteUser); // ken l manager ynajem yfasakh user
router.put('/:id', authenticateToken, updateUser); 

module.exports = router;
