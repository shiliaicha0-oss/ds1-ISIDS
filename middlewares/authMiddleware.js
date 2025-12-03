// middlewares/authMiddleware.js
// middleware hedha ychouf el JWT w y7ot l’utilisateur fi req.user

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// middleware yverifi el token
const authenticateToken = asyncHandler(async (req, res, next) => {

  // Ne5dhou el token mel header "Authorization" wala mel cookie
  // Format mtaa el header: "Bearer <token>"
  const authHeader = req.headers.authorization || req.cookies.token;
  let token = null;
  
  //// Ken el header mawjoud 
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Nfa9souha w na7thou partie mtaa token barka
    token = authHeader.split(' ')[1];
  } 
  // Ken ma fama ch header, nfarkssou fi cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Ken mal9ina hata token, nraja3ou 401
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  try {
    // Nverifiyou el token b JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Nlawjou 3al user mtaa token w ni7iw el motDePasse
    const user = await User.findById(decoded.id).select('-motDePasse');
    // Ken mal9inach user fil base
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    // N7otou el user fil req.user bch najmou nesta3mlouh fil routes
    req.user = user;
    // Net3adew lel next middleware
    next();
  } catch (err) {
    // Ken el token fih mochkla 
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

module.exports = { authenticateToken };
