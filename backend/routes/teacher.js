const express = require('express');
const { 
  getTeacherStats, 
  getStudentsNeedingAttention, 
  getClassPerformance 
} = require('../api/teacher/stats');

const router = express.Router();

// Mock authentication middleware - replace with real auth later
const mockAuth = (req, res, next) => {
  req.user = {
    teacher: {
      id: 10 // The teacher ID from your demo script
    }
  };
  next();
};

router.use(mockAuth);

// Fixed routes that match your frontend calls
router.get('/stats', async (req, res) => {
  try {
    const teacherId = req.user.teacher.id;
    const stats = await getTeacherStats(teacherId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/students/attention', async (req, res) => {
  try {
    const teacherId = req.user.teacher.id;
    const limit = parseInt(req.query.limit) || 5;
    const students = await getStudentsNeedingAttention(teacherId, limit);
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Students attention error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/classes/performance', async (req, res) => {
  try {
    const teacherId = req.user.teacher.id;
    const classes = await getClassPerformance(teacherId);
    res.json({ success: true, data: classes });
  } catch (error) {
    console.error('Class performance error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;