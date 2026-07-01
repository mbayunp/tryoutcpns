const { Question, Tryout, Category } = require('../models');
const response = require('../utils/response');

const getAllQuestions = async (req, res, next) => {
  try {
    const { tryout_id, category_id, program_type } = req.query;
    const whereClause = {};

    if (tryout_id) whereClause.tryout_id = tryout_id;
    if (category_id) whereClause.category_id = category_id;
    if (program_type) whereClause.program_type = program_type;

    const questions = await Question.findAll({
      where: whereClause,
      include: [
        { model: Tryout, as: 'tryout', attributes: ['id', 'title'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['id', 'ASC']]
    });

    return response.success(res, questions, 'Questions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    console.log("=== Received Payload ===", req.body);
    const {
      tryout_id,
      category_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      correct_answer,
      option_weights,
      options_weights,
      sub_category,
      program_type,
      scoring_type
    } = req.body;

    // Check if Tryout and Category exist
    const tryout = await Tryout.findByPk(tryout_id);
    if (!tryout) {
      return response.error(res, 'Tryout package not found', 400);
    }

    const category = await Category.findByPk(category_id);
    if (!category) {
      return response.error(res, 'Category not found', 400);
    }

    const newQuestion = await Question.create({
      tryout_id,
      category_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      correct_answer: correct_answer ? correct_answer.toLowerCase() : null,
      option_weights,
      options_weights,
      sub_category,
      program_type: program_type || 'SKD',
      scoring_type: scoring_type || 'BINARY'
    });

    // Automatically update tryout's total_questions count
    tryout.total_questions = await Question.count({ where: { tryout_id } });
    await tryout.save();

    return response.success(res, newQuestion, 'Question created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    console.log("=== Received Payload ===", req.body);
    const { id } = req.params;
    const {
      tryout_id,
      category_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      option_e,
      correct_answer,
      option_weights,
      options_weights,
      sub_category,
      program_type,
      scoring_type
    } = req.body;

    const q = await Question.findByPk(id);
    if (!q) {
      return response.error(res, 'Question not found', 404);
    }

    const oldTryoutId = q.tryout_id;

    if (tryout_id !== undefined) {
      const tryout = await Tryout.findByPk(tryout_id);
      if (!tryout) {
        return response.error(res, 'Tryout package not found', 400);
      }
    }

    if (category_id !== undefined) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return response.error(res, 'Category not found', 400);
      }
    }

    const updateData = {};
    if (tryout_id !== undefined) updateData.tryout_id = tryout_id;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (question !== undefined) updateData.question = question;
    if (option_a !== undefined) updateData.option_a = option_a;
    if (option_b !== undefined) updateData.option_b = option_b;
    if (option_c !== undefined) updateData.option_c = option_c;
    if (option_d !== undefined) updateData.option_d = option_d;
    if (option_e !== undefined) updateData.option_e = option_e;
    if (correct_answer !== undefined) updateData.correct_answer = correct_answer ? correct_answer.toLowerCase() : null;
    if (option_weights !== undefined) updateData.option_weights = option_weights;
    if (options_weights !== undefined) updateData.options_weights = options_weights;
    if (sub_category !== undefined) updateData.sub_category = sub_category;
    if (program_type !== undefined) updateData.program_type = program_type;
    if (scoring_type !== undefined) updateData.scoring_type = scoring_type;

    await q.update(updateData);

    // Recalculate total_questions for both tryouts if it was modified
    if (tryout_id !== undefined && tryout_id !== oldTryoutId) {
      const oldTryout = await Tryout.findByPk(oldTryoutId);
      if (oldTryout) {
        oldTryout.total_questions = await Question.count({ where: { tryout_id: oldTryoutId } });
        await oldTryout.save();
      }

      const newTryout = await Tryout.findByPk(tryout_id);
      if (newTryout) {
        newTryout.total_questions = await Question.count({ where: { tryout_id } });
        await newTryout.save();
      }
    }

    return response.success(res, q, 'Question updated successfully');
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const q = await Question.findByPk(id);
    if (!q) {
      return response.error(res, 'Question not found', 404);
    }

    const tryoutId = q.tryout_id;
    await q.destroy();

    // Recalculate total questions in tryout
    const tryout = await Tryout.findByPk(tryoutId);
    if (tryout) {
      tryout.total_questions = await Question.count({ where: { tryout_id: tryoutId } });
      await tryout.save();
    }

    return response.success(res, null, 'Question deleted successfully');
  } catch (err) {
    next(err);
  }
};

const bulkCreateQuestions = async (req, res, next) => {
  try {
    const { tryout_id, questions, program_type } = req.body;

    if (!tryout_id) {
      return response.error(res, 'Tryout ID is required', 400);
    }

    const tryout = await Tryout.findByPk(tryout_id);
    if (!tryout) {
      return response.error(res, 'Tryout package not found', 400);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return response.error(res, 'Questions list must be a non-empty array', 400);
    }

    const formattedQuestions = questions.map((q) => ({
      tryout_id,
      category_id: q.category_id,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      option_e: q.option_e,
      correct_answer: q.correct_answer ? q.correct_answer.toLowerCase() : null,
      option_weights: q.option_weights || null,
      options_weights: q.options_weights || null,
      sub_category: q.sub_category || null,
      program_type: q.program_type || program_type || 'SKD'
    }));

    const newQuestions = await Question.bulkCreate(formattedQuestions);

    // Update tryout's total_questions count
    tryout.total_questions = await Question.count({ where: { tryout_id } });
    await tryout.save();

    return response.success(res, newQuestions, 'Bulk questions created successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions
};
