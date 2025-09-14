const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware to verify JWT and ensure user is a teacher
const authenticateTeacher = async (req, res, next) => {
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

    // Get user with teacher profile
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        teacher: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'TEACHER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Teacher role required'
      });
    }

    if (!user.teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found'
      });
    }

    req.user = user;
    req.teacher = user.teacher;
    next();
  } catch (error) {
    console.error('Teacher auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// GET /api/teacher/dashboard - Teacher dashboard overview
router.get('/dashboard', authenticateTeacher, async (req, res) => {
  try {
    const teacher = req.teacher;
    
    // Get basic dashboard data
    const dashboardData = {
      teacher: {
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        employeeId: teacher.employeeId,
        department: teacher.department
      },
      stats: {
        totalClasses: 0, // TODO: Count from classes table
        totalStudents: 0, // TODO: Count students across all classes
        assessmentsCreated: 0,
        pendingGrading: 0
      },
      recentActivity: [], // TODO: Get recent assessments/student submissions
      upcomingDeadlines: [] // TODO: Get assessment due dates
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Teacher dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard'
    });
  }
});

// GET /api/teacher/classes - Teacher's classes
router.get('/classes', authenticateTeacher, async (req, res) => {
  try {
    const teacherId = req.teacher.id;
    
    // TODO: Implement when Class model relationships are ready
    const classes = [];
    
    res.json({
      success: true,
      data: {
        classes,
        total: classes.length
      }
    });
  } catch (error) {
    console.error('Teacher classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load classes'
    });
  }
});

// GET /api/teacher/students - Students in teacher's classes
router.get('/students', authenticateTeacher, async (req, res) => {
  try {
    const teacherId = req.teacher.id;
    
    // TODO: Implement when Class and Enrollment models are ready
    // This will need to join classes -> enrollments -> students
    const students = [];
    
    res.json({
      success: true,
      data: {
        students,
        total: students.length,
        byClass: {} // Students grouped by class
      }
    });
  } catch (error) {
    console.error('Teacher students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load students'
    });
  }
});

// GET /api/teacher/assessments - Teacher's assessments
router.get('/assessments', authenticateTeacher, async (req, res) => {
  try {
    const teacherId = req.teacher.id;
    
    // TODO: Implement when Assessment model relationships are ready
    const assessments = [];
    
    res.json({
      success: true,
      data: {
        assessments,
        total: assessments.length,
        draft: 0,
        published: 0,
        graded: 0
      }
    });
  } catch (error) {
    console.error('Teacher assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load assessments'
    });
  }
});

module.exports = router;