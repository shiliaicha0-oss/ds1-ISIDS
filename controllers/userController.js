const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// l manager yjib l users lkol 
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Seul le manager peut voir tous les utilisateurs.' });
    }
    const users = await User.find().select('-motDePasse');
    res.status(200).json({ users });
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};