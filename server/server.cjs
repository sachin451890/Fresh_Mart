const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const { router: cartRoutes } = require('./routes/cartRoutes');
const couponRoutes = require('./routes/couponRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'FreshMart Supermarket API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Serve Static Frontend (Prefer built React SPA dist folder if it exists)
const distPath = path.join(__dirname, '../dist');
const publicPath = path.join(__dirname, '../public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🥦 FreshMart Grocery Server is running!`);
  console.log(`🚀 Access application: http://localhost:${PORT}`);
  console.log(`📡 API Healthcheck:    http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
