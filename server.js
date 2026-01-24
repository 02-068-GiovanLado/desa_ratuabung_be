require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// General Middleware
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static Files
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Website Desa Ratu Abung',
    version: '1.0.0',
    status: 'running'
  });
});

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const beritaRoutes = require('./src/routes/berita.routes');
const productRoutes = require('./src/routes/product.routes');
const galeriRoutes = require('./src/routes/galeriRoutes');
const infografisRoutes = require('./src/routes/infografis.routes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/infografis', infografisRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});