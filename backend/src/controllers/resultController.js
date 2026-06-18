const resultService = require('../services/resultService');
const response = require('../utils/response');

const getResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await resultService.getResult(id, req.user.id);
    return response.success(res, result, 'Result retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await resultService.getHistory(req.user.id);
    return response.success(res, history, 'History retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getRanking = async (req, res, next) => {
  try {
    const { tryout_id } = req.query;
    // Default to tryout package 1 if not specified
    const targetTryoutId = tryout_id ? parseInt(tryout_id) : 1;
    const ranking = await resultService.getRanking(targetTryoutId);
    return response.success(res, ranking, 'Ranking retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getResult,
  getHistory,
  getRanking
};
