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

module.exports = {
  getResult,
  getHistory
};
