// register, login, logout
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// generate JWT
// Hedhi fonction ta3mel token JWT b l'id mtaa l user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /auth/register
exports.register = asyncHandler(async (req, res) => {
  // Houni nestanew nom, login, motDePasse, role (role optionnel)
  const { nom, login, motDePasse, role } = req.body;
  // Ken chay meyji (nom/login/motDePasse) nraja3ou 400
  if (!nom || !login || !motDePasse) {
    res.status(400);
    throw new Error('Les champs nom/login/motDePasse sont requis');
  }

  // Nchoufou est-ce que fama user bil login hedha
  const exists = await User.findOne({ login });
  if (exists) {
    res.status(400);
    throw new Error('Login déjà utilisé');
  }

// Ncretiw user jdid
  const user = await User.create({ nom, login, motDePasse, role });
  // Nraja3ou information mtaa l user + token
  res.status(201).json({
    _id: user._id,
    nom: user.nom,
    login: user.login,
    role: user.role,
    token: generateToken(user._id),
  });
});

// POST /auth/login
exports.login = asyncHandler(async (req, res) => {
    // Nestanew login + motDePasse
  const { login, motDePasse } = req.body;

  // Ken login wla mdp méch mawjoudin
  if (!login || !motDePasse) {
    res.status(400);
    throw new Error('Login et motDePasse requis');
  }
  // Nlawjou user bil login
  const user = await User.findOne({ login });

  // Ken user mawjoud
  if (user) {
    // N9arnou mot de passe b bcrypt (motDePasse fl base hashé)
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

    // Ken el mot de passe mawjoud w s7i7
    if (isMatch) {
      return res.json({
        _id: user._id,
        nom: user.nom,
        login: user.login,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  }
  // Ken l login ghalet wla el mdp ghalet
  res.status(401);
  throw new Error('Login ou mot de passe invalide');
});

// POST /auth/logout (optionnel) - si tu utilises cookies
exports.logout = asyncHandler(async (req, res) => {
    // Nfas5ou token men cookie en le mettant vide
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  // Nraja3ou message simple
  res.json({ message: 'Logged out' });
});
