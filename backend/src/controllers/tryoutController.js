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
    const { attempt_id, package_id, answers } = req.body;
    const { Attempt, AttemptAnswer, Answer, Question, Category, Tryout } = require('../models');
    const { calculateTotalScore } = require('../utils/scoreCalculator');
    
    let attempt;
    if (attempt_id) {
      attempt = await Attempt.findByPk(attempt_id);
    }
    
    const tryoutId = attempt ? attempt.tryout_id : (package_id || 1);
    
    // Securely retrieve questions and correct answers from database
    let dbQuestions = await Question.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Tryout,
          as: 'tryoutsMany',
          where: { id: tryoutId },
          attributes: [],
          through: { attributes: [] }
        }
      ]
    });
    
    if (dbQuestions.length === 0) {
      dbQuestions = await Question.findAll({
        where: { tryout_id: tryoutId },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ]
      });
    }
    
    // Format submitted answers
    const submittedAnswers = (answers || []).map(ans => ({
      question_id: ans.question_id,
      selected_answer: ans.selected_option || ans.selected_answer
    }));
    
    // Calculate total score using the utility function
    const { totalScore, answerDetails } = calculateTotalScore(dbQuestions, submittedAnswers);
    
    // Calculate category breakdown (scaled scores as in resultService)
    let twkCorrect = 0;
    let tiuCorrect = 0;
    let tkpRawSum = 0;
    
    answerDetails.forEach(detail => {
      const q = dbQuestions.find(dbQ => dbQ.id === detail.question_id);
      if (!q) return;
      
      const cat = q.category ? q.category.name.toUpperCase() : '';
      const selected = detail.selected_answer ? detail.selected_answer.toLowerCase().trim() : null;
      
      if (!selected) return;
      
      if (cat === 'TWK') {
        const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
        if (selected === correct) twkCorrect += 1;
      } else if (cat === 'TIU') {
        const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
        if (selected === correct) tiuCorrect += 1;
      } else if (cat === 'TKP') {
        if (q.option_weights) {
          const weights = typeof q.option_weights === 'string'
            ? JSON.parse(q.option_weights)
            : q.option_weights;
          tkpRawSum += weights[selected] || 0;
        } else {
          const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
          if (selected === correct) tkpRawSum += 5;
        }
      }
    });
    
    const computedTWK = twkCorrect * 15;
    const computedTIU = tiuCorrect * 17.5;
    const computedTKP = tkpRawSum * 4.5;
    const finalScore = Math.round(computedTWK + computedTIU + computedTKP);
    
    const passed = (computedTWK >= 65) && (computedTIU >= 80) && (computedTKP >= 166);
    const resultStatus = passed ? 'LULUS' : 'TIDAK LULUS';
    
    if (!attempt) {
      attempt = await Attempt.create({
        user_id: req.user.id,
        tryout_id: tryoutId,
        package_id: tryoutId,
        score: finalScore,
        twk: computedTWK,
        tiu: computedTIU,
        tkp: computedTKP,
        result: resultStatus,
        status: 'completed',
        finished_at: new Date()
      });
    } else {
      attempt.score = finalScore;
      attempt.twk = computedTWK;
      attempt.tiu = computedTIU;
      attempt.tkp = computedTKP;
      attempt.result = resultStatus;
      attempt.status = 'completed';
      attempt.finished_at = new Date();
      if (package_id) {
        attempt.package_id = package_id;
      }
      await attempt.save();
    }
    
    // Save answers details in BOTH tables
    if (answerDetails && answerDetails.length > 0) {
      await Answer.destroy({
        where: { attempt_id: attempt.id }
      });
      await AttemptAnswer.destroy({
        where: { attempt_id: attempt.id }
      });
      
      // Save to Answer model (answers table)
      const answersDataForAnswer = answerDetails.map(detail => ({
        attempt_id: attempt.id,
        question_id: detail.question_id,
        selected_answer: detail.selected_answer,
        is_correct: detail.is_correct
      }));
      await Answer.bulkCreate(answersDataForAnswer);
      
      // Save to AttemptAnswer model (attempt_answers table)
      const answersDataForAttemptAnswer = answerDetails.map(detail => ({
        attempt_id: attempt.id,
        question_id: detail.question_id,
        selected_option: detail.selected_answer,
        is_correct: detail.is_correct,
        score: detail.score || 0
      }));
      await AttemptAnswer.bulkCreate(answersDataForAttemptAnswer);
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
