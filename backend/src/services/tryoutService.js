const { sequelize, Tryout, Question, Category, Attempt, Answer } = require('../models');
const { calculateTotalScore } = require('../utils/scoreCalculator');

const getTryouts = async (isAdmin = false, programType = null) => {
  const whereClause = {};
  if (programType) {
    whereClause.program_type = programType;
  }
  // Return all tryouts for everyone so users can see and purchase locked premium tryouts
  return await Tryout.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']]
  });
};

const getTryoutById = async (id, userId, isAdmin = false) => {
  const tryout = await Tryout.findByPk(id);
  if (!tryout) {
    const error = new Error('Tryout not found');
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && tryout.status === 'inactive') {
    const { Transaction } = require('../models');
    const purchase = await Transaction.findOne({
      where: {
        user_id: userId,
        tryout_id: id,
        status: 'success'
      }
    });
    if (!purchase) {
      const error = new Error('Tryout ini terkunci. Silakan lakukan pembayaran terlebih dahulu.');
      error.statusCode = 403;
      throw error;
    }
  }

  // If loading questions, exclude correct_answer and option_weights for users to prevent cheating
  const attributes = isAdmin 
    ? ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer', 'option_weights']
    : ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e'];

  let questions = await Question.findAll({
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

  if (questions.length === 0) {
    questions = await Question.findAll({
      where: { tryout_id: id },
      attributes,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });
  }

  return {
    ...tryout.toJSON(),
    questions
  };
};

const startTryout = async (userId, tryoutId) => {
  const tryout = await Tryout.findByPk(tryoutId);
  if (!tryout) {
    const error = new Error('Tryout is not available');
    error.statusCode = 400;
    throw error;
  }

  // Check if tryout is locked (inactive)
  if (tryout.status === 'inactive') {
    const { Transaction } = require('../models');
    const purchase = await Transaction.findOne({
      where: {
        user_id: userId,
        tryout_id: tryoutId,
        status: 'success'
      }
    });
    if (!purchase) {
      const error = new Error('Tryout ini terkunci. Silakan lakukan pembayaran terlebih dahulu.');
      error.statusCode = 403;
      throw error;
    }
  }

  // Check if there is an ongoing attempt
  const existingAttempt = await Attempt.findOne({
    where: {
      user_id: userId,
      tryout_id: tryoutId,
      status: 'ongoing'
    }
  });

  if (existingAttempt) {
    return existingAttempt;
  }

  // Create new attempt
  return await Attempt.create({
    user_id: userId,
    tryout_id: tryoutId,
    score: 0,
    started_at: new Date(),
    status: 'ongoing'
  });
};

const submitTryout = async (userId, attemptId, submittedAnswers = []) => {
  const attempt = await Attempt.findOne({
    where: {
      id: attemptId,
      user_id: userId,
      status: 'ongoing'
    }
  });

  if (!attempt) {
    const error = new Error('No ongoing attempt found with this ID');
    error.statusCode = 404;
    throw error;
  }

  // Get all questions with categories for this tryout to calculate scores accurately
  let questions = await Question.findAll({
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: Tryout,
        as: 'tryoutsMany',
        where: { id: attempt.tryout_id },
        attributes: [],
        through: { attributes: [] }
      }
    ]
  });

  if (questions.length === 0) {
    questions = await Question.findAll({
      where: { tryout_id: attempt.tryout_id },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });
  }

  const { totalScore, answerDetails } = calculateTotalScore(questions, submittedAnswers);

  // Use transaction to save answers and update attempt
  const t = await sequelize.transaction();

  try {
    const { AttemptAnswer } = require('../models');

    // Delete any previous answers for this attempt (safety check) from both tables
    await Answer.destroy({ where: { attempt_id: attemptId }, transaction: t });
    await AttemptAnswer.destroy({ where: { attempt_id: attemptId }, transaction: t });

    // Save all answers in Answer model
    const answersData = answerDetails.map(detail => ({
      attempt_id: attemptId,
      question_id: detail.question_id,
      selected_answer: detail.selected_answer,
      is_correct: detail.is_correct
    }));
    await Answer.bulkCreate(answersData, { transaction: t });

    // Save all answers in AttemptAnswer model
    const attemptAnswersData = answerDetails.map(detail => ({
      attempt_id: attemptId,
      question_id: detail.question_id,
      selected_option: detail.selected_answer,
      is_correct: detail.is_correct,
      score: detail.is_correct ? 5 : 0
    }));
    await AttemptAnswer.bulkCreate(attemptAnswersData, { transaction: t });

    // Update attempt
    attempt.score = totalScore;
    attempt.status = 'completed';
    attempt.finished_at = new Date();
    await attempt.save({ transaction: t });

    await t.commit();

    return {
      attempt_id: attempt.id,
      tryout_id: attempt.tryout_id,
      score: totalScore,
      started_at: attempt.started_at,
      finished_at: attempt.finished_at,
      status: attempt.status
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getMyPackages = async (userId) => {
  const { Transaction } = require('../models');
  const transactions = await Transaction.findAll({
    where: {
      user_id: userId,
      status: 'success'
    },
    include: [{
      model: Tryout,
      as: 'tryout'
    }],
    order: [['created_at', 'DESC']]
  });

  // Extract unique tryouts from transactions
  const tryoutsMap = new Map();
  transactions.forEach(t => {
    if (t.tryout) {
      tryoutsMap.set(t.tryout.id, t.tryout);
    }
  });

  return Array.from(tryoutsMap.values());
};

module.exports = {
  getTryouts,
  getTryoutById,
  startTryout,
  submitTryout,
  getMyPackages
};
