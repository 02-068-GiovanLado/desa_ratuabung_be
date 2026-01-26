const prisma = require('../config/database');

// GET all infografis
exports.getAllInfografis = async (req, res, next) => {
  try {
    const infografis = await prisma.infografis.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: infografis || []
    });
  } catch (error) {
    console.error('❌ getAllInfografis Error:', error);
    next(error);
  }
};

// GET infografis by type
exports.getInfografisByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    const infografis = await prisma.infografis.findMany({
      where: {
        type: type
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: infografis || []
    });
  } catch (error) {
    console.error('❌ getInfografisByType Error:', error);
    next(error);
  }
};

// POST create infografis
exports.createInfografis = async (req, res, next) => {
  try {
    const { title, type, data, description, year } = req.body;

    console.log('📥 Creating infografis with data:', { title, type, description, year });

    // Validasi required fields
    if (!title || !type || !data) {
      return res.status(400).json({
        success: false,
        message: 'Field title, type, dan data wajib diisi'
      });
    }

    // Ensure data is a string (JSON stringified)
    let dataString = data;
    if (typeof data === 'object') {
      dataString = JSON.stringify(data);
    }

    const infografis = await prisma.infografis.create({
      data: {
        title: title.trim(),
        type: type.trim(),
        description: description ? description.trim() : '',
        data: dataString,
        year: year ? parseInt(year) : new Date().getFullYear(),
        published: true
      }
    });

    console.log('✅ Infografis created:', infografis);

    res.status(201).json({
      success: true,
      message: 'Infografis berhasil dibuat',
      data: infografis
    });
  } catch (error) {
    console.error('❌ createInfografis Error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Data sudah ada di database'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Gagal membuat infografis'
    });
  }
};

// PUT update infografis
exports.updateInfografis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type, data, description, year } = req.body;

    console.log('📝 Updating infografis with id:', id);

    // Validasi ID
    const infografisId = parseInt(id);
    if (isNaN(infografisId)) {
      return res.status(400).json({
        success: false,
        message: 'ID tidak valid'
      });
    }

    // Cek apakah infografis ada
    const existing = await prisma.infografis.findUnique({
      where: { id: infografisId }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Infografis tidak ditemukan'
      });
    }

    // Build update data
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (type) updateData.type = type.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : '';
    if (year) updateData.year = parseInt(year);
    if (data) {
      updateData.data = typeof data === 'object' ? JSON.stringify(data) : data;
    }

    const infografis = await prisma.infografis.update({
      where: { id: infografisId },
      data: updateData
    });

    console.log('✅ Infografis updated:', infografis);

    res.json({
      success: true,
      message: 'Infografis berhasil diupdate',
      data: infografis
    });
  } catch (error) {
    console.error('❌ updateInfografis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal update infografis'
    });
  }
};

// DELETE infografis
exports.deleteInfografis = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log('🗑️  Deleting infografis with id:', id);

    const infografisId = parseInt(id);
    if (isNaN(infografisId)) {
      return res.status(400).json({
        success: false,
        message: 'ID tidak valid'
      });
    }

    // Cek apakah ada
    const existing = await prisma.infografis.findUnique({
      where: { id: infografisId }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Infografis tidak ditemukan'
      });
    }

    await prisma.infografis.delete({
      where: { id: infografisId }
    });

    console.log('✅ Infografis deleted');

    res.json({
      success: true,
      message: 'Infografis berhasil dihapus'
    });
  } catch (error) {
    console.error('❌ deleteInfografis Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal hapus infografis'
    });
  }
};