const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Semua route di sini wajib login dan role admin
router.use(authMiddleware, adminOnly);

// GET profil admin yang sedang login
router.get('/profile', adminController.getProfile);

// PUT update nama & email
router.put('/profile', adminController.updateProfile);

// PUT ganti password
router.put('/password', adminController.updatePassword);

module.exports = router;