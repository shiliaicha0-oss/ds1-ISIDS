module.exports = (req, res, next) => {
  const { statut } = req.body;

  if (statut && !['todo', 'doing', 'done'].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide. (todo / doing / done)' });
  }

  next();
};
