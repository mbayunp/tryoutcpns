const tryoutService = require('../services/tryoutService');
const { Tryout, PackageQuestion, Attempt, AttemptAnswer, Answer, Transaction } = require('../models');
const response = require('../utils/response');

const getTryouts = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const tryouts = await tryoutService.getTryouts(isAdmin, req.query.program_type);
    return response.success(res, tryouts, 'Tryouts retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getTryoutById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tryoutCheck = await Tryout.findByPk(id);
    if (!tryoutCheck) {
      return res.status(404).json({ message: 'Try Out tidak ditemukan' });
    }

    const isAdmin = req.user.role === 'admin';
    const tryout = await tryoutService.getTryoutById(id, req.user.id, isAdmin);
    return response.success(res, tryout, 'Tryout details retrieved successfully');
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ message: 'Try Out tidak ditemukan' });
    }
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

const createTryout = async (req, res, next) => {
  try {
    const { title, description, duration, status, category, image_url, original_price, discount_percentage, price, program_type, product_type, wa_group_link, link_akses, file_path, benefits, shield_award, scoring_type } = req.body;
    
    let ebook_file_path = null;
    if (req.file) {
      ebook_file_path = 'uploads/ebooks/' + req.file.filename;
    } else if (file_path) {
      ebook_file_path = file_path;
    }

    let parsedBenefits = benefits;
    if (typeof benefits === 'string') {
      try {
        parsedBenefits = JSON.parse(benefits);
      } catch (e) {
        // ignore
      }
    }

    let parsedShieldAward = shield_award;
    if (typeof shield_award === 'string') {
      try {
        parsedShieldAward = JSON.parse(shield_award);
      } catch (e) {
        // ignore
      }
    }

    const newTryout = await Tryout.create({
      title,
      description,
      duration: duration !== undefined && duration !== '' ? parseInt(duration) : 0,
      status: status || 'active',
      category: category || 'Tryout',
      image_url,
      original_price: original_price !== undefined ? parseInt(original_price) : 0,
      discount_percentage: discount_percentage !== undefined ? parseInt(discount_percentage) : 0,
      price: price !== undefined ? parseInt(price) : 0,
      program_type: program_type || 'SKD',
      product_type: product_type || 'TRYOUT',
      wa_group_link: product_type === 'KELAS' ? (wa_group_link || link_akses || null) : null,
      ebook_file_path: product_type === 'EBOOK' ? ebook_file_path : null,
      benefits: parsedBenefits,
      shield_award: parsedShieldAward,
      scoring_type: scoring_type || 'BINARY'
    });
    return response.success(res, newTryout, 'Tryout created successfully', 201);
  } catch (err) {
    next(err);
  }
};
 
const updateTryout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, duration, status, category, image_url, original_price, discount_percentage, price, program_type, product_type, wa_group_link, link_akses, file_path, benefits, shield_award, scoring_type } = req.body;

    const tryout = await Tryout.findByPk(id);
    if (!tryout) {
      return response.error(res, 'Tryout not found', 404);
    }

    if (title !== undefined) tryout.title = title;
    if (description !== undefined) tryout.description = description;
    if (duration !== undefined) tryout.duration = duration !== '' ? parseInt(duration) : 0;
    if (status !== undefined) tryout.status = status;
    if (category !== undefined) tryout.category = category;
    if (image_url !== undefined) tryout.image_url = image_url;
    if (original_price !== undefined) tryout.original_price = parseInt(original_price) || 0;
    if (discount_percentage !== undefined) tryout.discount_percentage = parseInt(discount_percentage) || 0;
    if (price !== undefined) tryout.price = parseInt(price) || 0;
    if (program_type !== undefined) tryout.program_type = program_type;
    if (scoring_type !== undefined) tryout.scoring_type = scoring_type;
    
    if (product_type !== undefined) tryout.product_type = product_type;
    
    if (product_type === 'KELAS' || (tryout.product_type === 'KELAS' && (wa_group_link !== undefined || link_akses !== undefined))) {
      tryout.wa_group_link = wa_group_link !== undefined ? wa_group_link : link_akses;
    } else if (product_type && product_type !== 'KELAS') {
      tryout.wa_group_link = null;
    }

    if (req.file) {
      // Delete old ebook file if it exists to clean up disk space
      if (tryout.ebook_file_path) {
        const path = require('path');
        const fs = require('fs');
        const oldPath = path.join(__dirname, '../../', tryout.ebook_file_path);
        try {
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (err) {
          console.warn("Failed to delete old file, continuing...", err.message);
        }
      }
      tryout.ebook_file_path = 'uploads/ebooks/' + req.file.filename;
    } else if (file_path !== undefined) {
      tryout.ebook_file_path = file_path;
    } else if (product_type && product_type !== 'EBOOK') {
      // Clear and delete old ebook file if product type changed from EBOOK
      if (tryout.ebook_file_path) {
        const path = require('path');
        const fs = require('fs');
        const oldPath = path.join(__dirname, '../../', tryout.ebook_file_path);
        try {
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (err) {
          console.warn("Failed to delete old file, continuing...", err.message);
        }
      }
      tryout.ebook_file_path = null;
    }

     if (benefits !== undefined) {
       let parsedBenefits = benefits;
       if (typeof benefits === 'string') {
         try {
           parsedBenefits = JSON.parse(benefits);
         } catch (e) {
           // ignore
         }
       }
       tryout.benefits = parsedBenefits;
     }

     if (shield_award !== undefined) {
       let parsedShieldAward = shield_award;
       if (typeof shield_award === 'string') {
         try {
           parsedShieldAward = JSON.parse(shield_award);
         } catch (e) {
           // ignore
         }
       }
       tryout.shield_award = parsedShieldAward;
     }
 
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

    // Delete ebook file if it exists to clean up disk space
    if (tryout.ebook_file_path) {
      const path = require('path');
      const fs = require('fs');
      const oldPath = path.join(__dirname, '../../', tryout.ebook_file_path);
      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.warn("Failed to delete old file, continuing...", err.message);
      }
    }
    if (PackageQuestion) {
      await PackageQuestion.destroy({ where: { package_id: id } });
    }
    
    const attempts = await Attempt.findAll({ where: { tryout_id: id } });
    const attemptIds = attempts.map(a => a.id);
    if (attemptIds.length > 0) {
      if (AttemptAnswer) await AttemptAnswer.destroy({ where: { attempt_id: attemptIds } });
      if (Answer) await Answer.destroy({ where: { attempt_id: attemptIds } });
      await Attempt.destroy({ where: { id: attemptIds } });
    }

    if (Transaction) {
      await Transaction.destroy({ where: { tryout_id: id } });
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
      ? ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer', 'option_weights', 'options_weights', 'sub_category', 'scoring_type', 'program_type']
      : ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'sub_category', 'scoring_type', 'program_type'];
      
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
    
    const tryout = await Tryout.findByPk(tryoutId);
    const isPPPK = tryout && tryout.program_type === 'PPPK';

    // Force question program type if they are evaluated under this attempt
    if (isPPPK) {
      dbQuestions.forEach(q => {
        q.program_type = 'PPPK';
      });
    }

    // Calculate total score using the utility function
    const { totalScore, answerDetails } = calculateTotalScore(dbQuestions, submittedAnswers, tryout ? tryout.scoring_type : 'BINARY');
    
    let computedTWK = 0;
    let computedTIU = 0;
    let computedTKP = 0;
    let finalScore = 0;
    let resultStatus = 'LULUS';

    if (isPPPK) {
      answerDetails.forEach(detail => {
        const q = dbQuestions.find(dbQ => dbQ.id === detail.question_id);
        if (!q) return;
        
        const score = detail.score || 0;
        const subCat = q.sub_category ? q.sub_category.trim() : '';
        
        if (subCat === 'Teknis') {
          computedTWK += score;
        } else if (subCat === 'Manajerial') {
          computedTIU += score;
        } else if (subCat === 'Sosial Kultural' || subCat === 'Wawancara') {
          computedTKP += score;
        }
      });
      finalScore = computedTWK + computedTIU + computedTKP;
      resultStatus = 'LULUS';
    } else {
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
    }
    
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

const getMyPackages = async (req, res, next) => {
  try {
    const tryouts = await tryoutService.getMyPackages(req.user.id);
    return response.success(res, tryouts, 'Purchased packages retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const downloadEbook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const tryout = await Tryout.findByPk(id);
    if (!tryout) {
      return response.error(res, 'File e-book tidak ditemukan.', 404);
    }

    // Allow if free (price === 0) OR if admin OR if successful transaction exists
    const isFree = tryout.price === 0;

    const { Transaction } = require('../models');
    let transaction = null;
    if (!isFree) {
      transaction = await Transaction.findOne({
        where: {
          user_id: userId,
          tryout_id: id,
          status: 'success'
        }
      });
    }

    if (!isFree && !transaction && req.user.role !== 'admin') {
      return response.error(res, 'Anda belum membeli e-book ini atau pembayaran Anda belum diverifikasi.', 403);
    }

    if (!tryout.ebook_file_path) {
      return response.error(res, 'File e-book tidak ditemukan.', 404);
    }

    const path = require('path');
    const fs = require('fs');
    const absolutePath = path.join(__dirname, '../../', tryout.ebook_file_path);

    if (!fs.existsSync(absolutePath)) {
      return response.error(res, 'File di server tidak ditemukan.', 404);
    }

    return res.download(absolutePath, `${tryout.title}.pdf`);
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
  saveAttemptResult,
  getMyPackages,
  downloadEbook
};
