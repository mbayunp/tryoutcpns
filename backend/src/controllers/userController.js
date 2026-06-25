const { User } = require('../models');
const response = require('../utils/response');

const updateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Check if new email is already taken
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return response.error(res, 'Email sudah digunakan oleh pengguna lain', 400);
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    user.email = email;
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    return response.success(res, userResponse, 'Email berhasil diperbarui. (Catatan: verifikasi email belum diimplementasikan)');
  } catch (err) {
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return response.error(res, 'File foto wajib diunggah', 400);
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return response.error(res, 'User tidak ditemukan', 404);
    }

    // Build absolute URL for the avatar
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    user.avatar = avatarUrl;
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    return response.success(res, userResponse, 'Foto profil berhasil diperbarui');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateEmail,
  updateAvatar
};
