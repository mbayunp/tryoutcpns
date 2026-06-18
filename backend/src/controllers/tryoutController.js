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
    const tryout = await tryoutService.getTryoutById(id, req.user.id, isAdmin);
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

const assignQuestionsToPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question_ids } = req.body;
    
    const { PackageQuestion } = require('../models');
    
    await PackageQuestion.destroy({
      where: { package_id: id }
    });
    
    if (question_ids && question_ids.length > 0) {
      const records = question_ids.map(qid => ({
        package_id: id,
        question_id: qid
      }));
      await PackageQuestion.bulkCreate(records);
    }
    
    return response.success(res, null, 'Questions mapped to package successfully');
  } catch (err) {
    next(err);
  }
};

const getQuestionsForPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';
    const { Tryout, Question, Category } = require('../models');
    
    const tryout = await Tryout.findByPk(id);
    if (!tryout) {
      return response.error(res, 'Package not found', 404);
    }
    
    const attributes = isAdmin 
      ? ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer', 'option_weights']
      : ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e'];
      
    const questions = await Question.findAll({
      attributes,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Tryout,
          as: 'tryoutsMany',
          where: { id },
          attributes: [],
          through: { attributes: [] }
        }
      ]
    });
    
    return response.success(res, questions, 'Questions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const saveAttemptResult = async (req, res, next) => {
  try {
    const { attempt_id, package_id, score, twk, tiu, tkp, result, answers } = req.body;
    const { Attempt, AttemptAnswer } = require('../models');
    
    let attempt;
    if (attempt_id) {
      attempt = await Attempt.findByPk(attempt_id);
    }
    
    if (!attempt) {
      attempt = await Attempt.create({
        user_id: req.user.id,
        tryout_id: package_id || 1,
        package_id: package_id || 1,
        score: score || 0,
        twk: twk || 0,
        tiu: tiu || 0,
        tkp: tkp || 0,
        result: result || 'TIDAK LULUS',
        status: 'completed',
        finished_at: new Date()
      });
    } else {
      attempt.score = score !== undefined ? score : attempt.score;
      attempt.twk = twk !== undefined ? twk : attempt.twk;
      attempt.tiu = tiu !== undefined ? tiu : attempt.tiu;
      attempt.tkp = tkp !== undefined ? tkp : attempt.tkp;
      attempt.result = result || attempt.result;
      attempt.status = 'completed';
      attempt.finished_at = new Date();
      if (package_id) {
        attempt.package_id = package_id;
      }
      await attempt.save();
    }
    
    if (answers && answers.length > 0) {
      await AttemptAnswer.destroy({
        where: { attempt_id: attempt.id }
      });
      
      const answersData = answers.map(ans => ({
        attempt_id: attempt.id,
        question_id: ans.question_id,
        selected_option: ans.selected_option || ans.selected_answer,
        is_correct: ans.is_correct,
        score: ans.score || 0
      }));
      
      await AttemptAnswer.bulkCreate(answersData);
    }
    
    return response.success(res, {
      attempt_id: attempt.id,
      score: attempt.score,
      result: attempt.result
    }, 'Attempt results saved successfully');
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
  deleteTryout,
  assignQuestionsToPackage,
  getQuestionsForPackage,
  saveAttemptResult
};
