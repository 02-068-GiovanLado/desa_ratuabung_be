const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Helper function to get full image URL
const getImageUrl = (req, filename) => {
  if (!filename) return null;
  // If already base64 or full URL, return as is
  if (filename.startsWith('data:') || filename.startsWith('http')) return filename;
  // Build full URL for uploaded files
  return `${req.protocol}://${req.get('host')}/uploads/galeri/${path.basename(filename)}`;
};

exports.getAll = async (req, res) => {
  try {
    const galeri = await prisma.galeri.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const galeriWithFullUrls = galeri.map(item => ({
      ...item,
      image: item.image ? getImageUrl(req, item.image) : null
    }));

    res.json({ success: true, data: galeriWithFullUrls });
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

    const galeriWithFullUrl = {
      ...galeri,
      image: galeri.image ? getImageUrl(req, galeri.image) : null
    };

    res.json({ success: true, data: galeriWithFullUrl });
  } catch (error) {
    console.error('Error fetching galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data galeri' });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('📋 Create Galeri - Request body:', req.body);

    const { title, author, image } = req.body;
    let views = parseInt(req.body.views) || 0;

    // Validasi wajib
    if (!title || !author) {
      return res.status(400).json({ 
        success: false, 
        message: 'Judul dan pengarang wajib diisi' 
      });
    }

    if (!image) {
      return res.status(400).json({ 
        success: false, 
        message: 'Gambar wajib diupload' 
      });
    }

    console.log('✅ Image type:', typeof image);
    console.log('✅ Image preview:', image.substring(0, 50) + '...');

    const galeri = await prisma.galeri.create({
      data: {
        title,
        image, // Save as base64
        author,
        views
      }
    });

    const galeriWithFullUrl = {
      ...galeri,
      image: galeri.image
    };

    res.status(201).json({ 
      success: true, 
      message: 'Galeri berhasil dibuat',
      data: galeriWithFullUrl 
    });
  } catch (error) {
    console.error('Error creating galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat galeri: ' + error.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log('📋 Update Galeri - Request body:', req.body);
    console.log('📷 Update Galeri - Request file:', req.file);

    const { id } = req.params;
    const { title, author } = req.body;
    let views = req.body.views !== undefined ? parseInt(req.body.views) : undefined;

    // Get current galeri
    const currentGaleri = await prisma.galeri.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentGaleri) {
      return res.status(404).json({ 
        success: false, 
        message: 'Galeri tidak ditemukan' 
      });
    }

    // Build update data
    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (views !== undefined) updateData.views = views;

    // Handle image update
    if (req.file) {
      updateData.image = req.file.filename;

      // Delete old image if exists
      if (currentGaleri.image && !currentGaleri.image.startsWith('data:')) {
        const oldImagePath = path.join(__dirname, '../../uploads/galeri', path.basename(currentGaleri.image));
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
      }
    }

    const galeri = await prisma.galeri.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    const galeriWithFullUrl = {
      ...galeri,
      image: galeri.image ? getImageUrl(req, galeri.image) : null
    };

    res.json({ 
      success: true, 
      message: 'Galeri berhasil diupdate',
      data: galeriWithFullUrl 
    });
  } catch (error) {
    console.error('Error updating galeri:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Gagal update galeri' });
  }
};

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

    // Delete image file
    if (galeri.image && !galeri.image.startsWith('data:')) {
      const imagePath = path.join(__dirname, '../../uploads/galeri', path.basename(galeri.image));
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
    }

    res.json({ 
      success: true, 
      message: 'Galeri berhasil dihapus' 
    });
  } catch (error) {
    console.error('Error deleting galeri:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus galeri' });
  }
};