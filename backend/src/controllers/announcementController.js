const { Announcement } = require('../models');
const response = require('../utils/response');

// Get active announcement (Public)
const getActiveAnnouncement = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      where: { is_active: true },
      order: [['updated_at', 'DESC']]
    });
    return response.success(res, announcements, 'Active announcements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Get announcements for authenticated user notifications
const getUserAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['created_at', 'DESC']],
      limit: 15
    });
    return response.success(res, announcements, 'User announcements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Get all announcements (Admin)
const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['created_at', 'DESC']]
    });
    return response.success(res, announcements, 'All announcements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Create new announcement (Admin)
const createAnnouncement = async (req, res, next) => {
  try {
    const { text, link, is_active } = req.body;
    if (!text) {
      return response.error(res, 'Text is required', 400);
    }

    const newAnnouncement = await Announcement.create({
      text,
      link,
      is_active: is_active !== undefined ? is_active : true
    });

    return response.success(res, newAnnouncement, 'Announcement created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// Update announcement (Admin)
const updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, link, is_active } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return response.error(res, 'Announcement not found', 404);
    }

    if (text !== undefined) announcement.text = text;
    if (link !== undefined) announcement.link = link;
    if (is_active !== undefined) announcement.is_active = is_active;

    await announcement.save();

    return response.success(res, announcement, 'Announcement updated successfully');
  } catch (err) {
    next(err);
  }
};

// Delete announcement (Admin)
const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return response.error(res, 'Announcement not found', 404);
    }

    await announcement.destroy();
    return response.success(res, null, 'Announcement deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActiveAnnouncement,
  getUserAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
