const { Attempt, Tryout, Answer, Question, Category } = require('../models');

const getResult = async (attemptId, userId) => {
  const attempt = await Attempt.findOne({
    where: {
      id: attemptId,
      user_id: userId
    },
    include: [
      {
        model: Tryout,
        as: 'tryout',
        attributes: ['id', 'title', 'description', 'duration', 'total_questions']
      }
    ]
  });

  if (!attempt) {
    const error = new Error('Result not found or access denied');
    error.statusCode = 404;
    throw error;
  }

  // Fetch all answers with question details for reviews
  const answers = await Answer.findAll({
    where: { attempt_id: attemptId },
    include: [
      {
        model: Question,
        as: 'question',
        attributes: ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer', 'option_weights'],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });

  return {
    attempt,
    answers
  };
};

const getHistory = async (userId) => {
  return await Attempt.findAll({
    where: {
      user_id: userId,
      status: 'completed'
    },
    include: [
      {
        model: Tryout,
        as: 'tryout',
        attributes: ['id', 'title', 'duration', 'total_questions']
      }
    ],
    order: [['finished_at', 'DESC']]
  });
};

module.exports = {
  getResult,
  getHistory
};
