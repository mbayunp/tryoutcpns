const express = require('express');
const router = express.Router();
const tryoutController = require('../controllers/tryoutController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { tryoutValidation, startValidation, submitValidation } = require('../validations/tryoutValidation');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/ebooks');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for physical files (PDF/Images)
    fieldSize: 50 * 1024 * 1024 // 50MB for text fields (Base64/Rich Text)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

router.use(authMiddleware);

// Candidate / User Tryout Flow
router.get('/', tryoutController.getTryouts);
router.get('/my-packages', tryoutController.getMyPackages);
router.get('/:id', tryoutController.getTryoutById);
router.post('/start', startValidation, tryoutController.startTryout);
router.post('/submit', submitValidation, tryoutController.submitTryout);
router.get('/:id/download', tryoutController.downloadEbook);

// Administrative CRUD endpoints
router.post('/', adminMiddleware, upload.single('ebook_file'), tryoutValidation, tryoutController.createTryout);
router.put('/:id', adminMiddleware, upload.single('ebook_file'), tryoutValidation, tryoutController.updateTryout);
router.delete('/:id', adminMiddleware, tryoutController.deleteTryout);

// Package Questions Mapping
router.post('/:id/questions', adminMiddleware, tryoutController.assignQuestionsToPackage);
router.get('/:id/questions', tryoutController.getQuestionsForPackage);

module.exports = router;
