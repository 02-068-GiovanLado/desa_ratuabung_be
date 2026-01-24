const express = require('express');
const router = express.Router();
const infografisController = require('../controllers/infografis.controller');

// GET all infografis
router.get('/', infografisController.getAllInfografis);

// GET infografis by type
router.get('/type/:type', infografisController.getInfografisByType);

// POST create infografis (admin only)
router.post('/', infografisController.createInfografis);

// PUT update infografis (admin only)
router.put('/:id', infografisController.updateInfografis);

// DELETE infografis (admin only)
router.delete('/:id', infografisController.deleteInfografis);

module.exports = router;
