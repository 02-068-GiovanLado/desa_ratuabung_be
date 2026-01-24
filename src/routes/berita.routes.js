const express = require('express');
const router = express.Router();
const beritaController = require('../controllers/berita.controller');

// GET all berita
router.get('/', beritaController.getAllBerita);

// GET single berita by slug
router.get('/:slug', beritaController.getBeritaBySlug);

// POST create berita (admin only)
router.post('/', beritaController.createBerita);

// PUT update berita (admin only)
router.put('/:id', beritaController.updateBerita);

// DELETE berita (admin only)
router.delete('/:id', beritaController.deleteBerita);

module.exports = router;
