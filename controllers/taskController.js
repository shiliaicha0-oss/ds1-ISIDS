const asyncHandler = require('express-async-handler');
const Task = require('../models/task');
const Project = require('../models/project');
const User = require('../models/userModel');

// CREATE TASK (any authenticated user)
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

  const task = await Task.create({
    titre,
    description,
    statut,
    deadline,
    projet
  });

  res.status(201).json(task);
});

// GET MY TASKS (only tasks of projects I own or I'm assigned to)
exports.getMyTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tasks = await Task.find({
    $or: [
      { assignedTo: userId },
      { projet: { $in: await Project.find({ owner: userId }).distinct('_id') } }
    ]
  })
    .populate('projet', 'name')
    .populate('assignedTo', 'nom login');

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

  if (req.user.role !== 'manager' && !isOwner && !isAssigned) {
    res.status(403);
    throw new Error('Accès refusé');
  }

  res.json(task);
});

// UPDATE TASK (only manager or project owner)
exports.updateTask = asyncHandler(async (req, res) => {
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

  const { titre, description, statut, deadline } = req.body;

  if (titre) task.titre = titre;
  if (description) task.description = description;
  if (statut) task.statut = statut;
  if (deadline) task.deadline = deadline;

  const updated = await task.save();

  res.json(updated);
});

// ASSIGN TASK (manager only)
exports.assignTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Tâche non trouvée');
  }

  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  task.assignedTo = userId;
  await task.save();

  res.json({ message: 'Tâche assignée', task });
});

// DELETE TASK (manager or project owner)
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
