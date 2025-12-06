// nimportiw express-async-handler bch naamlo try/catch automatiquement
const asyncHandler = require('express-async-handler');
const Task = require('../models/task');
const Project = require('../models/project');
const User = require('../models/userModel');

// CREATE TASK (any authenticated user)
// ay user connecté ynajem yaaml task
exports.createTask = asyncHandler(async (req, res) => {
  const { titre, description, statut, deadline, projet } = req.body;

  if (!titre || !projet) {
    res.status(400);
    throw new Error('Titre et projet sont requis');
  }

  // Vérifier projet existe
  const project = await Project.findById(projet);
  if (!project) {
    res.status(404);
    throw new Error('Projet introuvable');
  }

  // naamlo création ll task 
  const task = await Task.create({
    titre,
    description,
    statut,
    deadline,
    projet
  });

  res.status(201).json(task);
});

// GET MY TASKS 
// yjib tasks li yetaal9ou bih :
// assignedTo = howa
// wala projects howa l owner mte3hom

exports.getMyTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tasks = await Task.find({
    $or: [
      { assignedTo: userId }, // taches assignées l user 
      { projet: { $in: await Project.find({ owner: userId }).distinct('_id') } }
    ]
  })
    .populate('projet', 'name')    //njib esm projet 
    .populate('assignedTo', 'nom login');   // esm w login mta3 elli assigned

  res.json(tasks);
});

// GET ALL TASKS (manager only)
exports.getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()
    .populate('projet', 'name owner')
    .populate('assignedTo', 'nom login');
  res.json(tasks);
});

// GET ONE TASK (manager OR project owner OR assigned user)
exports.getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('projet', 'name owner')
    .populate('assignedTo', 'nom login');

  if (!task) {
    res.status(404);
    throw new Error('Tâche non trouvée');
  }

  const isOwner = task.projet.owner.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo?.toString() === req.user._id.toString();

  // controle d'accès
  if (req.user.role !== 'manager' && !isOwner && !isAssigned) {
    res.status(403);
    throw new Error('Accès refusé');
  }

  res.json(task);
});

// UPDATE TASK (only manager or project owner)
// manager w project owner kahw
exports.updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('projet', 'owner');

  if (!task) {
    res.status(404);
    throw new Error('Tâche non trouvée');
  }

  const isOwner = task.projet.owner.toString() === req.user._id.toString();

  // accès interdit si mahouch manager wala owner
  if (req.user.role !== 'manager' && !isOwner) {
    res.status(403);
    throw new Error('Accès refusé');
  }
 
  // mise à jour
  const { titre, description, statut, deadline } = req.body;

  if (titre) task.titre = titre;
  if (description) task.description = description;
  if (statut) task.statut = statut;
  if (deadline) task.deadline = deadline;

  const updated = await task.save();

  res.json(updated);
});

// ASSIGN TASK (manager only)
// manager bark ynajm yaaml assign
exports.assignTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Tâche non trouvée');
  }

  const { userId } = req.body;
 // nchouf user mawjoud wila lee
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
// naamel assign
  task.assignedTo = userId;
  await task.save();

  res.json({ message: 'Tâche assignée', task });
});

// DELETE TASK (manager or project owner)
// manager wla project owner bark ynejm yfasakh
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('projet', 'owner');

  if (!task) {
    res.status(404);
    throw new Error('Tâche non trouvée');
  }

  const isOwner = task.projet.owner.toString() === req.user._id.toString();

  if (req.user.role !== 'manager' && !isOwner) {
    res.status(403);
    throw new Error('Accès refusé');
  }

  await task.deleteOne();

  res.json({ message: 'Tâche supprimée' });
});
