const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Public endpoint to show on landing page banner
router.get('/active', announcementController.getActiveAnnouncement);

// Admin-only endpoints to manage announcements
router.get('/', authMiddleware, adminMiddleware, announcementController.getAllAnnouncements);
router.post('/', authMiddleware, adminMiddleware, announcementController.createAnnouncement);
router.put('/:id', authMiddleware, adminMiddleware, announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware, adminMiddleware, announcementController.deleteAnnouncement);

module.exports = router;
