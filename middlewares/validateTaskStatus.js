// middleware bch nverifiw statut mta3 task 9bal ma ykaml l requete
module.exports = (req, res, next) => {
  const { statut } = req.body;
// ken utilisateur baath statut, nchoufou shah wila lé
  // statut lazim yakoun wahed men: todo / doing / done
  if (statut && !['todo', 'doing', 'done'].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide. (todo / doing / done)' });
  }
// ken kol chay cv, n3adiw ll middleware elli baadou
  next();
};
