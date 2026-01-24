const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res) => {
  try {
    const galeri = await prisma.galeri.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: galeri });
  } catch (error) {
    console.error('Error fetching galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data galeri' });
  }
};

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
    res.status(500).json({ success: false, message: 'Gagal mengambil data galeri' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, image, author } = req.body;
    
    const galeri = await prisma.galeri.create({
      data: { title, image, author: author || 'Admin' }
    });
    
    res.status(201).json({ success: true, data: galeri });
  } catch (error) {
    console.error('Error creating galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat galeri' });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, image, author } = req.body;
    
    const galeri = await prisma.galeri.update({
      where: { id: parseInt(req.params.id) },
      data: { title, image, author }
    });
    
    res.json({ success: true, data: galeri });
  } catch (error) {
    console.error('Error updating galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal update galeri' });
  }
};

exports.delete = async (req, res) => {
  try {
    await prisma.galeri.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: 'Galeri berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus galeri' });
  }
};