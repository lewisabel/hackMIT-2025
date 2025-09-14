const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api/test',
      auth: {
        test: '/api/auth/test',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        debug: 'GET /api/auth/quick-debug'
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Use auth routes
app.use('/api/auth', authRoutes);

// 404 handler for unmatched routes - FIXED
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requested: `${req.method} ${req.originalUrl}`,
    availableRoutes: {
      GET: [
        '/',
        '/health',
        '/api/test',
        '/api/auth/test',
        '/api/auth/quick-debug'
      ],
      POST: [
        '/api/auth/register',
        '/api/auth/login'
      ]
    }
  });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error('=== EXPRESS ERROR ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request:', `${req.method} ${req.url}`);
  console.error('Body:', req.body);
  console.error('====================');
  
  res.status(err.status || 500).json({ 
    success: false,
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
  console.log('📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/test`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/quick-debug`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});