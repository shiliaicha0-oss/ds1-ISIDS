const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },

  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },

  deadline: { type: Date },

  // Tache associée à un projet
  projet: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

  // L'utilisateur assigné (manager uniquement peut changer ça)
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
