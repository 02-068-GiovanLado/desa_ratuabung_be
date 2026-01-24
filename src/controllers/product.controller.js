const prisma = require('../config/database');
const fs = require('fs');
const path = require('path');

// Helper function to get full image URL
const getImageUrl = (req, filename) => {
  if (!filename) return null;
  // If already base64 or full URL, return as is
  if (filename.startsWith('data:') || filename.startsWith('http')) return filename;
  // Build full URL for uploaded files
  return `${req.protocol}://${req.get('host')}/uploads/products/${path.basename(filename)}`;
};

// GET all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, limit = 10, page = 1 } = req.query;
    
    const where = {
      published: true,
      ...(category && category !== 'Semua' && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { seller: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: parseInt(limit),
        skip,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    const productsWithFullUrls = products.map(product => ({
      ...product,
      image: product.image ? getImageUrl(req, product.image) : null
    }));

    res.json({
      success: true,
      data: productsWithFullUrls,
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

// GET products by category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    
    const products = await prisma.product.findMany({
      where: {
        category,
        published: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const productsWithFullUrls = products.map(product => ({
      ...product,
      image: product.image ? getImageUrl(req, product.image) : null
    }));

    res.json({
      success: true,
      data: productsWithFullUrls
    });
  } catch (error) {
    next(error);
  }
};

// GET single product by slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const productWithFullUrl = {
      ...product,
      image: product.image ? getImageUrl(req, product.image) : null
    };

    res.json({
      success: true,
      data: productWithFullUrl
    });
  } catch (error) {
    next(error);
  }
};

// POST create product
exports.createProduct = async (req, res, next) => {
  try {
    console.log('📦 Request body:', req.body);
    console.log('📷 Request file:', req.file);
    console.log('📋 Content-Type:', req.get('content-type'));
    console.log('🖼️  Image from body (type):', typeof req.body.image);
    console.log('🖼️  Image from body (value):', req.body.image);
    
    const { name, category, price, unit, seller, whatsapp, stock, description, image } = req.body;
    
    const baseSlug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const uniqueId = Date.now().toString().slice(-6);
    const slug = `${baseSlug}-${uniqueId}`;
    
    // Handle image properly
    let imageUrl = null;
    if (req.file) {
      // From file upload
      imageUrl = req.file.filename;
    } else if (image) {
      // From body - ensure it's a string
      if (typeof image === 'string' && image.trim()) {
        imageUrl = image;
      } else if (typeof image === 'object' && image.url) {
        // If image is an object with url property
        imageUrl = image.url;
      }
    }
    
    console.log('✅ Final image URL:', imageUrl);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        price: parseInt(price),
        unit,
        seller,
        whatsapp: whatsapp || '',
        stock: parseInt(stock),
        description: description || '',
        image: imageUrl
      }
    });

    const productWithFullUrl = {
      ...product,
      image: product.image ? getImageUrl(req, product.image) : null
    };

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: productWithFullUrl
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// PUT update product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get current product
    const currentProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build update data - hanya field yang valid
    const updateData = {};
    
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.price) updateData.price = parseInt(req.body.price);
    if (req.body.stock !== undefined) updateData.stock = parseInt(req.body.stock);
    if (req.body.unit) updateData.unit = req.body.unit;
    if (req.body.seller) updateData.seller = req.body.seller;
    if (req.body.whatsapp !== undefined) updateData.whatsapp = req.body.whatsapp || '';
    if (req.body.description !== undefined) updateData.description = req.body.description || '';

    // Handle new image upload (file or base64)
    if (req.file) {
      updateData.image = req.file.filename;
      
      // Delete old image if exists
      if (currentProduct.image && !currentProduct.image.startsWith('data:')) {
        const oldImagePath = path.join(__dirname, '../../uploads/products', path.basename(currentProduct.image));
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
      }
    } else if (req.body.image) {
      // Support base64 string from frontend
      updateData.image = req.body.image;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    const productWithFullUrl = {
      ...product,
      image: product.image ? getImageUrl(req, product.image) : null
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: productWithFullUrl
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    if (product.image) {
      const imagePath = path.join(__dirname, '../../uploads/products', path.basename(product.image));
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
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};