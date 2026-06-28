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
        attributes: ['id', 'title', 'description', 'duration', 'total_questions', 'program_type']
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
        attributes: ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer', 'option_weights', 'options_weights', 'sub_category'],
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

  const isPPPK = attempt.tryout && attempt.tryout.program_type === 'PPPK';

  let computedTWK = 0;
  let computedTIU = 0;
  let computedTKP = 0;
  let finalScore = 0;
  let resultStatus = 'LULUS';
  let correctCount = 0;

  if (isPPPK) {
    answers.forEach(ans => {
      const q = ans.question;
      if (!q) return;

      const selected = ans.selected_answer ? ans.selected_answer.toUpperCase().trim() : null;
      if (!selected) return;

      const weights = q.options_weights || q.option_weights;
      let score = 0;
      if (weights) {
        const parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
        score = parsedWeights[selected] || parsedWeights[selected.toLowerCase()] || 0;
      }

      const subCat = q.sub_category ? q.sub_category.trim() : '';
      if (subCat === 'Teknis') {
        computedTWK += score;
      } else if (subCat === 'Manajerial') {
        computedTIU += score;
      } else if (subCat === 'Sosial Kultural' || subCat === 'Wawancara') {
        computedTKP += score;
      }

      if (score > 0) {
        correctCount += 1;
      }
    });
    finalScore = computedTWK + computedTIU + computedTKP;
  } else {
    let twkCorrect = 0;
    let tiuCorrect = 0;
    let tkpRawSum = 0;

    answers.forEach(ans => {
      const q = ans.question;
      if (!q) return;

      const catName = q.category ? q.category.name.toUpperCase() : '';
      const selected = ans.selected_answer ? ans.selected_answer.toLowerCase().trim() : null;

      if (!selected) return;

      if (catName === 'TWK') {
        const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
        if (selected === correct) twkCorrect += 1;
      } else if (catName === 'TIU') {
        const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
        if (selected === correct) tiuCorrect += 1;
      } else if (catName === 'TKP') {
        const weights = q.options_weights || q.option_weights;
        if (weights) {
          const parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
          tkpRawSum += parsedWeights[selected] || parsedWeights[selected.toUpperCase()] || 0;
        } else {
          const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
          if (selected === correct) tkpRawSum += 5;
        }
      }
    });

    computedTWK = twkCorrect * 15;
    computedTIU = tiuCorrect * 17.5;
    computedTKP = tkpRawSum * 4.5;
    finalScore = Math.round(computedTWK + computedTIU + computedTKP);

    const passed = (computedTWK >= 65) && (computedTIU >= 80) && (computedTKP >= 166);
    resultStatus = passed ? 'LULUS' : 'TIDAK LULUS';
    correctCount = twkCorrect + tiuCorrect;
  }

  return {
    attempt: {
      ...attempt.toJSON(),
      score: finalScore,
      twk: computedTWK,
      tiu: computedTIU,
      tkp: computedTKP,
      result: resultStatus,
      correctCount: correctCount
    },
    answers
  };
};

const getHistory = async (userId) => {
  const attempts = await Attempt.findAll({
    where: {
      user_id: userId,
      status: 'completed'
    },
    include: [
      {
        model: Tryout,
        as: 'tryout',
        attributes: ['id', 'title', 'duration', 'total_questions', 'program_type']
      }
    ],
    order: [['finished_at', 'DESC']]
  });

  const results = [];
  for (const attempt of attempts) {
    // Fetch answers for this attempt
    const answers = await Answer.findAll({
      where: { attempt_id: attempt.id },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'correct_answer', 'option_weights', 'options_weights', 'sub_category'],
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    const isPPPK = attempt.tryout && attempt.tryout.program_type === 'PPPK';

    let computedTWK = 0;
    let computedTIU = 0;
    let computedTKP = 0;
    let finalScore = 0;
    let resultStatus = 'LULUS';
    let correctCount = 0;

    if (isPPPK) {
      answers.forEach(ans => {
        const q = ans.question;
        if (!q) return;

        const selected = ans.selected_answer ? ans.selected_answer.toUpperCase().trim() : null;
        if (!selected) return;

        const weights = q.options_weights || q.option_weights;
        let score = 0;
        if (weights) {
          const parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
          score = parsedWeights[selected] || parsedWeights[selected.toLowerCase()] || 0;
        }

        const subCat = q.sub_category ? q.sub_category.trim() : '';
        if (subCat === 'Teknis') {
          computedTWK += score;
        } else if (subCat === 'Manajerial') {
          computedTIU += score;
        } else if (subCat === 'Sosial Kultural' || subCat === 'Wawancara') {
          computedTKP += score;
        }

        if (score > 0) {
          correctCount += 1;
        }
      });
      finalScore = computedTWK + computedTIU + computedTKP;
    } else {
      let twkCorrect = 0;
      let tiuCorrect = 0;
      let tkpRawSum = 0;

      answers.forEach(ans => {
        const q = ans.question;
        if (!q) return;

        const catName = q.category ? q.category.name.toUpperCase() : '';
        const selected = ans.selected_answer ? ans.selected_answer.toLowerCase().trim() : null;

        if (!selected) return;

        if (catName === 'TWK') {
          const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
          if (selected === correct) twkCorrect += 1;
        } else if (catName === 'TIU') {
          const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
          if (selected === correct) tiuCorrect += 1;
        } else if (catName === 'TKP') {
          const weights = q.options_weights || q.option_weights;
          if (weights) {
            const parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
            tkpRawSum += parsedWeights[selected] || parsedWeights[selected.toUpperCase()] || 0;
          } else {
            const correct = q.correct_answer ? q.correct_answer.toLowerCase().trim() : '';
            if (selected === correct) tkpRawSum += 5;
          }
        }
      });

      computedTWK = twkCorrect * 15;
      computedTIU = tiuCorrect * 17.5;
      computedTKP = tkpRawSum * 4.5;
      finalScore = Math.round(computedTWK + computedTIU + computedTKP);

      const passed = (computedTWK >= 65) && (computedTIU >= 80) && (computedTKP >= 166);
      resultStatus = passed ? 'LULUS' : 'TIDAK LULUS';
      correctCount = twkCorrect + tiuCorrect;
    }

    results.push({
      id: attempt.id,
      user_id: attempt.user_id,
      tryout_id: attempt.tryout_id,
      score: finalScore,
      started_at: attempt.started_at,
      finished_at: attempt.finished_at,
      status: attempt.status,
      tryout: attempt.tryout,
      twk: computedTWK,
      tiu: computedTIU,
      tkp: computedTKP,
      result: resultStatus,
      correctCount: correctCount
    });
  }

  return results;
};

const getRanking = async (tryoutId) => {
  const { Attempt, User } = require('../models');

  const attempts = await Attempt.findAll({
    where: {
      tryout_id: tryoutId,
      status: 'completed'
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['score', 'DESC'], ['finished_at', 'ASC']]
  });

  const bestAttemptsMap = {};
  attempts.forEach(attempt => {
    const userId = attempt.user_id;
    if (!bestAttemptsMap[userId] || bestAttemptsMap[userId].score < attempt.score) {
      bestAttemptsMap[userId] = attempt;
    }
  });

  const rankingList = Object.values(bestAttemptsMap);

  // Sort initially by total score DESC
  rankingList.sort((a, b) => b.score - a.score);

  return rankingList.map((attempt) => {
    return {
      userId: attempt.user_id,
      userName: attempt.user ? attempt.user.name : 'Unknown User',
      email: attempt.user ? attempt.user.email : 'unknown@user.com',
      score: attempt.score,
      twk: attempt.twk || 0,
      tiu: attempt.tiu || 0,
      tkp: attempt.tkp || 0,
      result: attempt.result,
      finishedAt: attempt.finished_at
    };
  });
};

module.exports = {
  getResult,
  getHistory,
  getRanking
};
