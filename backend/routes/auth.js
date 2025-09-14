require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

console.log('Initializing auth routes...');

const prisma = new PrismaClient();

// Initialize Supabase
let supabase;
try {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✅ Supabase client initialized');
} catch (error) {
  console.error('❌ Failed to initialize Supabase:', error);
}

// REGISTER
router.post('/register', async (req, res) => {
  console.log('\n=== REGISTRATION ATTEMPT ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { email, password, firstName, lastName, studentId, gradeLevel, role } = req.body;

    // 1. Validate input
    if (!email || !password || !firstName || !lastName) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, first name, and last name are required' 
      });
    }

    // Validate role if provided
    if (role && !['STUDENT', 'TEACHER'].includes(role)) {
      console.log('❌ Invalid role:', role);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be STUDENT or TEACHER' 
      });
    }

    const userRole = role || 'STUDENT';

    // 2. Check if user exists
    console.log('Step 1: Checking if user exists...');
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email }
      });
      console.log('User exists?', existingUser ? 'Yes' : 'No');
    } catch (dbError) {
      console.error('❌ Database error checking user:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database connection error' 
      });
    }

    if (existingUser) {
      console.log('❌ User already exists');
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // 3. Create Supabase user
    console.log('Step 2: Creating Supabase user...');
    let supabaseUserId;
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) {
        console.error('❌ Supabase error:', authError);
        return res.status(400).json({ 
          success: false,
          message: 'Failed to create auth account',
          details: authError.message 
        });
      }

      supabaseUserId = authData.user.id;
      console.log('✅ Supabase user created:', supabaseUserId);
    } catch (supabaseError) {
      console.error('❌ Supabase exception:', supabaseError);
      return res.status(500).json({ 
        success: false,
        message: 'Auth service error',
        details: supabaseError.message 
      });
    }

    // 4. Create database user with transaction
    console.log('Step 3: Creating database user...');
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            passwordHash: hashedPassword,
            role: userRole
          }
        });

        let profileData = null;

        if (userRole === 'STUDENT') {
          const student = await tx.student.create({
            data: {
              userId: user.id,
              firstName,
              lastName,
              studentId: studentId || null,
              gradeLevel: gradeLevel || null
            }
          });
          profileData = {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            studentId: student.studentId,
            gradeLevel: student.gradeLevel,
            enrollmentDate: student.enrollmentDate
          };
        } else if (userRole === 'TEACHER') {
          const teacher = await tx.teacher.create({
            data: {
              userId: user.id,
              firstName,
              lastName,
              employeeId: studentId || null, // You might want to rename this field in the request
              department: gradeLevel || null // You might want to rename this field in the request
            }
          });
          profileData = {
            id: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            employeeId: teacher.employeeId,
            department: teacher.department
          };
        }

        return { user, profile: profileData };
      });

      console.log('✅ Database user created:', result.user.id);
      console.log('=== REGISTRATION SUCCESS ===\n');

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          createdAt: result.user.createdAt,
          isActive: result.user.isActive,
          profile: result.profile
        }
      });

    } catch (dbError) {
      console.error('❌ Database error creating user:', dbError);
      
      // Clean up Supabase user if database fails
      if (supabaseUserId) {
        console.log('Attempting to delete Supabase user after database failure...');
        try {
          await supabase.auth.admin.deleteUser(supabaseUserId);
          console.log('✅ Supabase user cleanup successful');
        } catch (cleanupError) {
          console.error('❌ Failed to cleanup Supabase user:', cleanupError);
        }
      }
      
      // Handle specific Prisma errors
      if (dbError.code === 'P2002') {
        const field = dbError.meta?.target?.[0];
        return res.status(400).json({ 
          success: false,
          message: `${field || 'Field'} already exists` 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: 'Failed to create user profile',
        details: dbError.message 
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      details: error.message 
    });
  }
});

// LOGIN (you might want to add this)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Use Supabase for authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Get user profile from database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        teacher: true
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.student || user.teacher,
        accessToken: data.session.access_token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});


// GET /api/auth/me - Get current user info
router.get('/me', async (req, res) => {
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        student: true,
        teacher: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: user.student,
        teacher: user.teacher
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

console.log('Auth routes loaded successfully');
module.exports = router;