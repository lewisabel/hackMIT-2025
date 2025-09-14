const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173', // Add Vite default port
    'http://localhost:3001'  // Add current backend port for testing
  ],
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
      auth: {
        test: '/api/auth/test',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        debug: 'GET /api/auth/quick-debug'
      },
      student: {
        dashboard: 'GET /api/student/dashboard',
        assessments: 'GET /api/student/assessments',
        progress: 'GET /api/student/progress',
        classes: 'GET /api/student/classes'
      },
      teacher: {
        dashboard: 'GET /api/teacher/dashboard',
        stats: 'GET /api/teacher/:id/stats',
        classPerformance: 'GET /api/teacher/:id/classes/performance',
        studentsAttention: 'GET /api/teacher/:id/students/attention',
        classes: 'GET /api/teacher/classes',
        students: 'GET /api/teacher/students',
        assessments: 'GET /api/teacher/assessments'
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

// 404 handler for unmatched routes
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
        '/api/auth/test',
        '/api/auth/quick-debug',
        '/api/student/dashboard',
        '/api/student/assessments', 
        '/api/student/progress',
        '/api/student/classes',
        '/api/teacher/dashboard',
        '/api/teacher/:id/stats',
        '/api/teacher/:id/classes/performance',
        '/api/teacher/:id/students/attention',
        '/api/teacher/classes',
        '/api/teacher/students',
        '/api/teacher/assessments'
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
  console.log('   AUTH:');
  console.log(`   GET  http://localhost:${PORT}/api/auth/test`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log('   STUDENT:');
  console.log(`   GET  http://localhost:${PORT}/api/student/dashboard`);
  console.log(`   GET  http://localhost:${PORT}/api/student/assessments`);
  console.log(`   GET  http://localhost:${PORT}/api/student/progress`);
  console.log(`   GET  http://localhost:${PORT}/api/student/classes`);
  console.log('   TEACHER:');
  console.log(`   GET  http://localhost:${PORT}/api/teacher/dashboard`);
  console.log(`   GET  http://localhost:${PORT}/api/teacher/{id}/stats`);
  console.log(`   GET  http://localhost:${PORT}/api/teacher/{id}/classes/performance`);
  console.log(`   GET  http://localhost:${PORT}/api/teacher/{id}/students/attention`);
  console.log(`   GET  http://localhost:${PORT}/api/teacher/classes`);
  console.log(`   GET  http://localhost:${PORT}/api/teacher/students`);
  console.log(`   GET  http://localhost:${PORT}/api/teacher/assessments`);
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