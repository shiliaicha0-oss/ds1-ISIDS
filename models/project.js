// model hedha mtaa "Project" bch n5abiw fih projets fi database

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

  // Esm mtaa projet (mawjoud obligatoire)
  name: { type: String, required: true },

  // Description optionnelle
  description: { type: String },

  // L’owner houwa l’utilisateur li 3mal projet (référence lel User)
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Statut mtaa projet (just trois valeurs permis)
  status: { 
    type: String, 
    enum: ['en cours', 'termine', 'en pause'], // valeurs autorisées
    default: 'en cours' // par défaut projet mched fih
  },

  // Date création automatiquement fi Date.now
  createdAt: { type: Date, default: Date.now }
});

// Nsajjlou model "Project" bch nesta3mlouh fi app
module.exports = mongoose.model('Project', projectSchema);
