const prisma = require('../config/database');

// GET all infografis
exports.getAllInfografis = async (req, res, next) => {
  try {
    const infografis = await prisma.infografis.findMany({
      where: { published: true },
      orderBy: { year: 'desc' }
    });

    res.json({
      success: true,
      data: infografis
    });
  } catch (error) {
    next(error);
  }
};

// GET infografis by type
exports.getInfografisByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    
    const infografis = await prisma.infografis.findMany({
      where: {
        type,
        published: true
      },
      orderBy: { year: 'desc' }
    });

    res.json({
      success: true,
      data: infografis
    });
  } catch (error) {
    next(error);
  }
};

// POST create infografis
exports.createInfografis = async (req, res, next) => {
  try {
    const { title, type, data, year } = req.body;

    const infografis = await prisma.infografis.create({
      data: {
        title,
        type,
        data,
        year: parseInt(year)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Infografis created successfully',
      data: infografis
    });
  } catch (error) {
    next(error);
  }
};

// PUT update infografis
exports.updateInfografis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const infografis = await prisma.infografis.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Infografis updated successfully',
      data: infografis
    });
  } catch (error) {
    next(error);
  }
};

// DELETE infografis
exports.deleteInfografis = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.infografis.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Infografis deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
