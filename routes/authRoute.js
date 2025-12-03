// Houni n7ottou routes mtaa l'authentification (register, login, logout)

const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// Route POST bch na3mlou inscription (register)
router.post('/register', register);

// Route POST bch na3mlou connexion (login)
router.post('/login', login);

// Route POST bch na3mlou déconnexion (logout)
router.post('/logout', logout);

module.exports = router;
