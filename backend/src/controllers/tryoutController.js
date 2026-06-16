const tryoutService = require('../services/tryoutService');
const { Tryout } = require('../models');
const response = require('../utils/response');

const getTryouts = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const tryouts = await tryoutService.getTryouts(isAdmin);
    return response.success(res, tryouts, 'Tryouts retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getTryoutById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';
    const tryout = await tryoutService.getTryoutById(id, isAdmin);
    return response.success(res, tryout, 'Tryout details retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const startTryout = async (req, res, next) => {
  try {
    const { tryout_id } = req.body;
    const attempt = await tryoutService.startTryout(req.user.id, tryout_id);
    return response.success(res, attempt, 'Tryout started successfully', 201);
  } catch (err) {
    next(err);
  }
};

const submitTryout = async (req, res, next) => {
  try {
    const { attempt_id, answers } = req.body;
    const result = await tryoutService.submitTryout(req.user.id, attempt_id, answers);
    return response.success(res, result, 'Tryout submitted successfully');
  } catch (err) {
    next(err);
  }
};

// Admin CRUD Operations
const createTryout = async (req, res, next) => {
  try {
    const { title, description, duration, status } = req.body;
    const newTryout = await Tryout.create({
      title,
      description,
      duration,
      status: status || 'active'
    });
    return response.success(res, newTryout, 'Tryout created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateTryout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, duration, status } = req.body;

    const tryout = await Tryout.findByPk(id);
    if (!tryout) {
      return response.error(res, 'Tryout not found', 404);
    }

    if (title !== undefined) tryout.title = title;
    if (description !== undefined) tryout.description = description;
    if (duration !== undefined) tryout.duration = duration;
    if (status !== undefined) tryout.status = status;

    await tryout.save();
    return response.success(res, tryout, 'Tryout updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteTryout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tryout = await Tryout.findByPk(id);
    if (!tryout) {
      return response.error(res, 'Tryout not found', 404);
    }

    await tryout.destroy();
    return response.success(res, null, 'Tryout deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTryouts,
  getTryoutById,
  startTryout,
  submitTryout,
  createTryout,
  updateTryout,
  deleteTryout
};
