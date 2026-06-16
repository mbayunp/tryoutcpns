const { calculateTotalScore } = require('./src/utils/scoreCalculator');

// Mock questions
const questions = [
  {
    id: 1,
    category: { name: 'TWK' },
    correct_answer: 'a',
    option_weights: null
  },
  {
    id: 2,
    category: { name: 'TIU' },
    correct_answer: 'c',
    option_weights: null
  },
  {
    id: 3,
    category: { name: 'TKP' },
    correct_answer: 'c',
    option_weights: {
      a: 3,
      b: 1,
      c: 5,
      d: 4,
      e: 2
    }
  }
];

const runTests = () => {
  console.log('--- Running Score Calculator Unit Tests ---');

  // Test Case 1: All correct
  const submission1 = [
    { question_id: 1, selected_answer: 'a' },
    { question_id: 2, selected_answer: 'c' },
    { question_id: 3, selected_answer: 'c' }
  ];
  const res1 = calculateTotalScore(questions, submission1);
  console.log('Test 1 (All Correct) - Expected Score: 15, Got:', res1.totalScore);
  console.log('Answer Details:', res1.answerDetails);

  // Test Case 2: Partial correct, TKP gets weight 4 (d)
  const submission2 = [
    { question_id: 1, selected_answer: 'a' }, // 5 points
    { question_id: 2, selected_answer: 'b' }, // 0 points
    { question_id: 3, selected_answer: 'd' }  // 4 points
  ];
  const res2 = calculateTotalScore(questions, submission2);
  console.log('Test 2 (Partial/Weighted) - Expected Score: 9, Got:', res2.totalScore);
  console.log('Answer Details:', res2.answerDetails);

  // Test Case 3: Empty answers
  const submission3 = [];
  const res3 = calculateTotalScore(questions, submission3);
  console.log('Test 3 (Empty submission) - Expected Score: 0, Got:', res3.totalScore);

  console.log('--- Unit Tests Completed ---');
};

runTests();
