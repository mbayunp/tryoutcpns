const { Announcement } = require('../models');
const response = require('../utils/response');
const { Op } = require('sequelize');

const getActiveAnnouncement = async (req, res, next) => {
  try {
    const whereClause = { is_active: true, user_id: null };
    if (req.query.program_type) {
      whereClause.program_type = req.query.program_type;
    }
    const announcements = await Announcement.findAll({
      where: whereClause,
      order: [['updated_at', 'DESC']]
    });
    return response.success(res, announcements, 'Active announcements retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getUserAnnouncements = async (req, res, next) => {
  try {
    const whereClause = {
      [Op.or]: [
        { user_id: null },
        { user_id: req.user.id }
      ],
      is_active: true
    };
    if (req.query.program_type) {
      whereClause.program_type = req.query.program_type;
    }
    const announcements = await Announcement.findAll({
      where: whereClause,
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
    const whereClause = {};
    if (req.query.program_type) {
      whereClause.program_type = req.query.program_type;
    }
    const announcements = await Announcement.findAll({
      where: whereClause,
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
    const { text, link, is_active, program_type } = req.body;
    if (!text) {
      return response.error(res, 'Text is required', 400);
    }

    const newAnnouncement = await Announcement.create({
      text,
      link,
      is_active: is_active !== undefined ? is_active : true,
      program_type: program_type || 'SKD'
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
    const { text, link, is_active, program_type } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return response.error(res, 'Announcement not found', 404);
    }

    if (text !== undefined) announcement.text = text;
    if (link !== undefined) announcement.link = link;
    if (is_active !== undefined) announcement.is_active = is_active;
    if (program_type !== undefined) announcement.program_type = program_type;

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
