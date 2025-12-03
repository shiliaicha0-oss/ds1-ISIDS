const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// GET ALL USERS (Manager only)
// fonction hedhi ta3mel récupération mtaa tous les utilisateurs (manager bark)
exports.getAllUsers = async (req, res) => {
  try {
    // Ken el user mouch manager, refuser l’accès
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Seul le manager peut voir tous les utilisateurs.' });
    }

    // Nlawjou 3al users w nfaskho motDePasse men response
    const users = await User.find().select('-motDePasse');

    // Nraj3ou el users
    res.status(200).json({ users });

  } catch (err) {
    // Ken fama erreur fi server
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

//  GET USER BY ID (Manager OR the user himself)
// fonction hedhi bch njibou user mtaa ID (manager wla l user nafssou)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-motDePasse');

    // Ken user meyjiich
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Ken mouch manager w mouch el user nafssou, accès refusé
    if (req.user.role !== 'manager' && req.user._id !== user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    // Nraja3ou user
    res.status(200).json({ user });

  } catch (err) {
    console.error('Erreur lors de la récupération de l’utilisateur:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// UPDATE USER
// Manager ynajm ybaddel 9bal users
// User normal ynajm ybaddel compte mtaaou kahaw
exports.updateUser = async (req, res) => {
  try {
    const { nom, login, motDePasse, role } = req.body;
    const user = await User.findById(req.params.id);

    // Ken user meyjiich
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Permission: ken mouch manager w mouch el user nafssou
    if (req.user.role !== 'manager' && req.user._id !== user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    // Nbadlou el champs li awelhom
    if (nom) user.nom = nom;
    if (login) user.login = login;

    // Role ybadlou manager bark
    if (role && req.user.role === 'manager') {
      user.role = role;
    }

    // Hash lel mot de passe ken badlou
    if (motDePasse) {
      user.motDePasse = await bcrypt.hash(motDePasse, 10);
    }

    // Nsaveiw modifications
    const updatedUser = await user.save();

    // Nraj3ou resultat
    res.status(200).json({
      message: "Utilisateur mis à jour",
      user: {
        _id: updatedUser._id,
        nom: updatedUser.nom,
        login: updatedUser.login,
        role: updatedUser.role,
      }
    });

  } catch (err) {
    console.error('Erreur lors de la mise à jour:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// DELETE USER (Manager only)
// fonction hedhi bch tfasakh user (manager bark)
exports.deleteUser = async (req, res) => {
  try {
    // Ken mouch manager, accès refusé
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Seul le manager peut supprimer un utilisateur.' });
    }

    const user = await User.findById(req.params.id);

    // Ken user meyjiich
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Nfaskho user
    await user.deleteOne();

    res.status(200).json({ message: 'Utilisateur supprimé.' });

  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
