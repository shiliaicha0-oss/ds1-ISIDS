const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: { type: String, enum: ['user', 'manager'], default: 'user' },
  dateCreation: { type: Date, default: Date.now }
});


UserSchema.pre('save', async function () {
  // ken l mot de passe ma tbadlch ma naamlo chay
  if (!this.isModified('motDePasse')) return;

  // Hash du mot de passe
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Export modèle
module.exports = mongoose.model('User', UserSchema);
