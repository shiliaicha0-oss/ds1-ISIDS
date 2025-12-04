// controllers/projectController.js
// Controller mtaa les projets : création, récupération, modification, suppression

const asyncHandler = require('express-async-handler');
const Project = require('../models/project');
const User = require('../models/userModel');

// POST /projects  => create project (any authenticated user)
exports.createProject = asyncHandler(async (req, res) => {
  // Nchoufou les données mte3 formulaire
  const { name, description, status } = req.body;

  // Ken ma fama ch name, neraj3ou erreur
  if (!name) {
    res.status(400);
    throw new Error('Le nom du projet est requis');
  }

  // Naamlou création du projet w n7ottou owner howa l user connecté
  const project = await Project.create({
    name,
    description,
    status,
    owner: req.user._id,
  });

  // Rédponse succès 201 b projet créé
  res.status(201).json(project);
});

// GET /projects  => get projects of connected user (owner)
exports.getMyProjects = asyncHandler(async (req, res) => {
  // Naakhou paramètres de recherche w pagination
  const { search, sort, page = 1, limit = 10, status } = req.query;

  // Filtre de base : projets mte3 user connecté
  const filter = { owner: req.user._id };

  // Filtrage par statut
  if (status) filter.status = status;

  // Filtrage par recherche (sur name)
  if (search) filter.name = { $regex: search, $options: 'i' };

  // Pagination
  const skip = (page - 1) * limit;

  // Requête bch njib projects
  const query = Project.find(filter).skip(skip).limit(+limit);

  // Tri (sort)
  if (sort) {
    const [field, order] = sort.split(':');
    query.sort({ [field]: order === 'desc' ? -1 : 1 });
  }

  // Execution de la requête
  const projects = await query;

  // Réponse b projects mte3 user
  res.json(projects);
});

// GET /projects/all => manager: see all projects
exports.getAllProjects = asyncHandler(async (req, res) => {
  // Houni middleware isManager howa li y7mi route
  const projects = await Project.find().populate('owner', 'nom login role');

  // Rédponse b tous les projets (seulement manager)
  res.json(projects);
});

// GET /projects/:id
exports.getProjectById = asyncHandler(async (req, res) => {
  // Njibou projet b id mte3 URL
  const project = await Project.findById(req.params.id).populate('owner', 'nom login');

  // Si projet mawjoudch
  if (!project) {
    res.status(404);
    throw new Error('Projet non trouvé');
  }

  // Vérifier si manager wela nafs l owner
  if (
    req.user.role !== 'manager' &&
    project.owner._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Accès refusé');
  }

  // Réponse b projet
  res.json(project);
});

// PUT /projects/:id  => update (owner or manager)
exports.updateProject = asyncHandler(async (req, res) => {
  // Nl9aw projet li bshu yenqadlu
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Projet non trouvé');
  }

  // Vérifier permissions : soit manager soit owner
  if (
    req.user.role !== 'manager' &&
    project.owner.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Accès refusé');
  }

  // Naakhou données bch nbadlouhom
  const { name, description, status } = req.body;

  if (name) project.name = name;
  if (description) project.description = description;
  if (status) project.status = status;

  // Save modifications
  const updated = await project.save();

  // Réponse b projet modifié
  res.json(updated);
});

// DELETE /projects/:id  => owner or manager
exports.deleteProject = asyncHandler(async (req, res) => {
  // Njib projet
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Projet non trouvé');
  }

  // Permission : manager wela owner
  if (
    req.user.role !== 'manager' &&
    project.owner.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Accès refusé');
  }

  // Supprimer projet
  await project.remove();

  // Réponse succès
  res.json({ message: 'Projet supprimé' });
});
