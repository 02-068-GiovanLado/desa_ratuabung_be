const prisma = require('../config/database');

// GET all berita
exports.getAllBerita = async (req, res, next) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;
    
    const where = {
      published: true,
      ...(category && { category })
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [berita, total] = await Promise.all([
      prisma.berita.findMany({
        where,
        take: parseInt(limit),
        skip,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.berita.count({ where })
    ]);

    res.json({
      success: true,
      data: berita,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET single berita by slug
exports.getBeritaBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const berita = await prisma.berita.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });

    if (!berita) {
      return res.status(404).json({
        success: false,
        message: 'Berita not found'
      });
    }

    res.json({
      success: true,
      data: berita
    });
  } catch (error) {
    next(error);
  }
};

// POST create berita
exports.createBerita = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, author } = req.body;
    
    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const berita = await prisma.berita.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        author,
        published: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berita created successfully',
      data: berita
    });
  } catch (error) {
    next(error);
  }
};

// PUT update berita
exports.updateBerita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const berita = await prisma.berita.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Berita updated successfully',
      data: berita
    });
  } catch (error) {
    next(error);
  }
};

// DELETE berita
exports.deleteBerita = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.berita.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Berita deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
