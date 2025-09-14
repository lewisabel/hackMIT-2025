// backend/scripts/link-supabase-teacher.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkSupabaseTeacher() {
  try {
    console.log('Creating teacher record for Supabase user...');

    // You need to get the UUID from Supabase Dashboard
    // Go to Supabase Dashboard > Authentication > Users
    // Find sarah.johnson@school.edu and copy the User ID (UUID)
    
    const SUPABASE_USER_ID = '62333e6a-7861-4266-ad07-461438b215d2'; // Replace with actual UUID from Supabase
    const TEACHER_EMAIL = 'sarah.johnson@school.edu';

    // Create user record in Prisma (using Supabase UUID)
    const user = await prisma.user.create({
      data: {
        email: TEACHER_EMAIL,
        role: 'TEACHER',
        passwordHash: 'supabase_auth',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    });

    console.log('Created user record:', user.email);

    // Create teacher record
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        firstName: 'Sarah',
        lastName: 'Johnson',
        employeeId: `EMP${Date.now()}`,
        department: 'Mathematics'
      }
    });

    console.log('Created teacher record:', `${teacher.firstName} ${teacher.lastName}`);

    // Create some classes for this teacher
    const classData = [
      {
        classCode: `MATH${Date.now()}`,
        name: 'Algebra I',
        subject: 'Mathematics',
        teacherId: teacher.id,
        description: 'Introduction to algebraic concepts',
        schoolName: 'MIT Academy',
        academicYear: '2024-2025',
        semester: 'Fall',
        schedule: 'MWF 10:00-11:00',
        roomNumber: 'Room 101'
      },
      {
        classCode: `GEOM${Date.now()}`,
        name: 'Geometry',
        subject: 'Mathematics',
        teacherId: teacher.id,
        description: 'Study of shapes and spatial relationships',
        schoolName: 'MIT Academy',
        academicYear: '2024-2025',
        semester: 'Fall',
        schedule: 'TTh 2:00-3:30',
        roomNumber: 'Room 102'
      }
    ];

    const classes = [];
    for (const classInfo of classData) {
      const newClass = await prisma.class.create({
        data: classInfo
      });
      classes.push(newClass);
      console.log(`Created class: ${newClass.name}`);
    }

    // Get some existing students to enroll
    const students = await prisma.student.findMany({
      take: 8,
      where: { user: { isActive: true } }
    });

    if (students.length > 0) {
      console.log(`Enrolling ${students.length} students in classes...`);
      
      let enrollmentCount = 0;
      for (const student of students) {
        for (const classRecord of classes) {
          await prisma.enrollment.create({
            data: {
              studentId: student.id,
              classId: classRecord.id,
              enrollmentDate: new Date(),
              status: 'ACTIVE'
            }
          });
          enrollmentCount++;
        }
      }
      
      console.log(`Created ${enrollmentCount} enrollments`);
    } else {
      console.log('No students found to enroll');
    }

    // Create some sample lessons
    for (const classRecord of classes) {
      for (let i = 1; i <= 3; i++) {
        await prisma.lesson.create({
          data: {
            classId: classRecord.id,
            lessonNumber: i,
            title: `${classRecord.name} - Lesson ${i}`,
            description: `Learning objectives for lesson ${i}`,
            topicsCovered: JSON.stringify([`Topic ${i}A`, `Topic ${i}B`]),
            learningObjectives: JSON.stringify([
              `Understand concept ${i}`,
              `Apply knowledge practically`
            ]),
            lessonDate: new Date()
          }
        });
      }
    }

    console.log('\n✅ Setup complete!');
    console.log(`Teacher ID: ${teacher.id}`);
    console.log(`You can now log in with: ${TEACHER_EMAIL} / teacher123`);
    console.log(`Classes created: ${classes.length}`);
    console.log(`Students enrolled: ${students.length} per class`);

  } catch (error) {
    console.error('Error linking Supabase teacher:', error);
    
    if (error.code === 'P2002') {
      console.log('\nTip: The user record might already exist. Try this instead:');
      console.log('1. Check if user already exists in your Prisma database');
      console.log('2. Just create the teacher record with the existing user ID');
    }
  } finally {
    await prisma.$disconnect();
  }
}

linkSupabaseTeacher();