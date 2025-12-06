
const mongoose = require('mongoose');
// Schema mta3 "Task" bch n5abou fih taches mta3 projets

const taskSchema = new mongoose.Schema({
  // Titre obligatoire mta3 tâche
  titre: { type: String, required: true },

  // Description optionnelle
  description: { type: String },

  // Statut mta3 tâche (maykoun ken todo / doing / done)
  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },

  // Deadline taa tâche (optionnel)
  deadline: { type: Date },

  // Tache associée à un projet
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

  // L'utilisateur assigné (manager uniquement peut changer ça)
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Date création automatique
  createdAt: { type: Date, default: Date.now }
});

// model "Task" bch nesta3mlouh fil controllers
module.exports = mongoose.model('Task', taskSchema);
