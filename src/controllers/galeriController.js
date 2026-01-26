const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all galeri
exports.getAll = async (req, res) => {
  try {
    const galeri = await prisma.galeri.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: galeri });
  } catch (error) {
    console.error('Error fetching galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data galeri', error: error.message });
  }
};

// GET by ID
exports.getById = async (req, res) => {
  try {
    const galeri = await prisma.galeri.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!galeri) {
      return res.status(404).json({ success: false, message: 'Galeri tidak ditemukan' });
    }
    res.json({ success: true, data: galeri });
  } catch (error) {
    console.error('Error fetching galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data galeri', error: error.message });
  }
};

// CREATE galeri
exports.create = async (req, res) => {
  try {
    const { title, author, image } = req.body;

    if (!title || !author || !image) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, author, dan image wajib diisi' 
      });
    }

    const galeri = await prisma.galeri.create({
      data: {
        title,
        author,
        image
      }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Galeri berhasil dibuat',
      data: galeri 
    });
  } catch (error) {
    console.error('Error creating galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat galeri', error: error.message });
  }
};

// UPDATE galeri
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, image } = req.body;

    const galeri = await prisma.galeri.findUnique({
      where: { id: parseInt(id) }
    });

    if (!galeri) {
      return res.status(404).json({ 
        success: false, 
        message: 'Galeri tidak ditemukan' 
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (image !== undefined) updateData.image = image;

    const updated = await prisma.galeri.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ 
      success: true, 
      message: 'Galeri berhasil diupdate',
      data: updated 
    });
  } catch (error) {
    console.error('Error updating galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal update galeri', error: error.message });
  }
};

// DELETE galeri
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const galeri = await prisma.galeri.findUnique({
      where: { id: parseInt(id) }
    });

    if (!galeri) {
      return res.status(404).json({ 
        success: false, 
        message: 'Galeri tidak ditemukan' 
      });
    }

    await prisma.galeri.delete({
      where: { id: parseInt(id) }
    });

    res.json({ 
      success: true, 
      message: 'Galeri berhasil dihapus' 
    });
  } catch (error) {
    console.error('Error deleting galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus galeri', error: error.message });
  }
};