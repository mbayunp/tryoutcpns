/**
 * Calculates the score of a user's answer for a question
 * @param {Object} question - The Question instance with Category included
 * @param {string} selectedAnswer - The answer selected by user ('a', 'b', 'c', 'd', 'e' or null)
 * @returns {Object} { score: number, isCorrect: boolean }
 */
const calculateQuestionScore = (question, selectedAnswer) => {
  if (!selectedAnswer) {
    return { score: 0, isCorrect: false };
  }

  const normalizedAnswer = selectedAnswer.toUpperCase().trim();
  const normalizedAnswerLower = selectedAnswer.toLowerCase().trim();

  // PPPK Evaluation Logic
  if (question.program_type === 'PPPK') {
    const weights = question.options_weights || question.option_weights;
    let score = 0;
    if (weights) {
      const parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
      score = parsedWeights[normalizedAnswer] || parsedWeights[normalizedAnswerLower] || 0;
    }
    return { score, isCorrect: score > 0 };
  }

  const correctAnswer = question.correct_answer ? question.correct_answer.toLowerCase().trim() : '';

  // Get category name
  const categoryName = question.category ? question.category.name.toUpperCase() : '';

  if (categoryName === 'TKP') {
    // TKP has weighted scores for options (typically 1 to 5)
    let score = 0;
    if (question.option_weights) {
      const weights = typeof question.option_weights === 'string'
        ? JSON.parse(question.option_weights)
        : question.option_weights;

      score = weights[normalizedAnswerLower] || weights[normalizedAnswer] || 0;
    } else {
      // Fallback if no weights are defined: correct answer gets 5, others get 0
      score = normalizedAnswerLower === correctAnswer ? 5 : 0;
    }
    // In TKP, there is no absolute "correct" but we can say isCorrect is true if they got the max possible score (5)
    return { score, isCorrect: score === 5 };
  } else {
    // TWK or TIU (or default): correct = 5, wrong = 0
    const isCorrect = normalizedAnswerLower === correctAnswer;
    const score = isCorrect ? 5 : 0;
    return { score, isCorrect };
  }
};

/**
 * Calculates total score from list of questions and selected answers
 * @param {Array} questions - Array of question objects with included category
 * @param {Array} submittedAnswers - Array of { question_id, selected_answer }
 * @returns {Object} { totalScore, answerDetails }
 */
const calculateTotalScore = (questions, submittedAnswers) => {
  let totalScore = 0;
  const answerDetails = [];

  // Map submitted answers by question_id for fast lookup
  const submissionMap = {};
  submittedAnswers.forEach(ans => {
    submissionMap[ans.question_id] = ans.selected_answer;
  });

  questions.forEach(q => {
    const selectedAnswer = submissionMap[q.id] || null;
    const { score, isCorrect } = calculateQuestionScore(q, selectedAnswer);

    totalScore += score;
    answerDetails.push({
      question_id: q.id,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      score: score
    });
  });

  return {
    totalScore,
    answerDetails
  };
};

module.exports = {
  calculateQuestionScore,
  calculateTotalScore
};
