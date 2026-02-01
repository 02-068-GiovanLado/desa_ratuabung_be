const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

// GET /api/admin/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil profil',
    });
  }
};

// PUT /api/admin/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan email tidak boleh kosong',
      });
    }

    // Cek apakah email sudah digunakan oleh user lain
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists && emailExists.id !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Email ini sudah digunakan oleh akun lain',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedUser,
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui profil',
    });
  }
};

// PUT /api/admin/password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini dan password baru wajib diisi',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter',
      });
    }

    // Ambil user lengkap termasuk password hash
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    // Verifikasi password saat ini
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini tidak benar',
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password berhasil diubah',
    });
  } catch (error) {
    console.error('updatePassword error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengubah password',
    });
  }
};