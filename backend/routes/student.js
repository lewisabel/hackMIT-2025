const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware to verify JWT and ensure user is a student
const authenticateStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get user with student profile
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        student: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Student role required'
      });
    }

    if (!user.student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    req.user = user;
    req.student = user.student;
    next();
  } catch (error) {
    console.error('Student auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// GET /api/student/dashboard - Student dashboard overview
router.get('/dashboard', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    
    // Get basic dashboard data
    const dashboardData = {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        gradeLevel: student.gradeLevel,
        enrollmentDate: student.enrollmentDate
      },
      stats: {
        totalAssessments: 0, // TODO: Count from assessments table
        completedAssessments: 0,
        averageScore: 0,
        classesEnrolled: 0 // TODO: Count from enrollments
      },
      recentActivity: [], // TODO: Get recent assessments/AI sessions
      upcomingAssessments: [] // TODO: Get scheduled assessments
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard'
    });
  }
});

// GET /api/student/assessments - Student's assessments
router.get('/assessments', authenticateStudent, async (req, res) => {
  try {
    const studentId = req.student.id;
    
    // TODO: Implement when Assessment model relationships are ready
    const assessments = [];
    
    res.json({
      success: true,
      data: {
        assessments,
        total: assessments.length,
        completed: 0,
        pending: 0
      }
    });
  } catch (error) {
    console.error('Student assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load assessments'
    });
  }
});

// GET /api/student/progress - Student's learning progress
router.get('/progress', authenticateStudent, async (req, res) => {
  try {
    const studentId = req.student.id;
    
    // TODO: Implement when LearningProgress model is ready
    const progress = {
      overallProgress: 0,
      subjectProgress: [],
      recentAchievements: [],
      learningGoals: []
    };
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Student progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load progress'
    });
  }
});

// GET /api/student/classes - Student's enrolled classes
router.get('/classes', authenticateStudent, async (req, res) => {
  try {
    const studentId = req.student.id;
    
    // TODO: Implement when Class and Enrollment models are ready
    const classes = [];
    
    res.json({
      success: true,
      data: {
        classes,
        total: classes.length
      }
    });
  } catch (error) {
    console.error('Student classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load classes'
    });
  }
});

module.exports = router;