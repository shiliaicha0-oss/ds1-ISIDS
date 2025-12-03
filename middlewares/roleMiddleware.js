// Hedhi middleware tchecki est-ce que l’utilisateur howa manager wla le
const asyncHandler = require('express-async-handler');

const isManager = asyncHandler(async (req, res, next) => {
    // Ken ma famech req.user (ma3neha l user moch connecté)
  if (!req.user) {
    res.status(401);
    throw new Error('Not authenticated');
  }
  // Ken l user connecté ama role mte3ou moch "manager"
  if (req.user.role !== 'manager') {
    res.status(403);
    throw new Error('Access denied: manager only');
  }
  // Ken kol chay mriguel, n3adiw lel next middleware
  next();
});

module.exports = { isManager };
