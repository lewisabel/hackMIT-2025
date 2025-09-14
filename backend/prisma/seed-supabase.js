// prisma/seed-supabase.js
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

async function main() {
  console.log('🌱 Starting Supabase-compatible seeding...');

  // Clear existing Prisma data (but NOT Supabase auth users)
  console.log('🧹 Clearing Prisma data...');
  await prisma.topicAssessment.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.aISession.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  // ======================================
  // CREATE TEST ACCOUNTS IN SUPABASE AUTH
  // ======================================

  console.log('👨‍🏫 Creating teacher accounts in Supabase...');
  
  const teacherAccounts = [
    { email: 'sarah.johnson@school.edu', password: 'teacher123', firstName: 'Sarah', lastName: 'Johnson', department: 'Mathematics' },
    { email: 'michael.chen@school.edu', password: 'teacher123', firstName: 'Michael', lastName: 'Chen', department: 'Science' },
    { email: 'emily.rodriguez@school.edu', password: 'teacher123', firstName: 'Emily', lastName: 'Rodriguez', department: 'English' }
  ];

  const teachers = [];

  for (const teacherData of teacherAccounts) {
    try {
      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: teacherData.email,
        password: teacherData.password,
        email_confirm: true,
        user_metadata: {
          role: 'TEACHER',
          firstName: teacherData.firstName,
          lastName: teacherData.lastName
        }
      });

      if (authError) {
        console.error(`Failed to create auth user for ${teacherData.email}:`, authError);
        continue;
      }

      console.log(`✅ Created Supabase auth user: ${teacherData.email}`);

      // Create corresponding records in your Prisma database
      const user = await prisma.user.create({
        data: {
          id: authUser.user.id, // Use Supabase UUID as the ID
          email: teacherData.email,
          role: 'TEACHER',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        }
      });

      const teacher = await prisma.teacher.create({
        data: {
          userId: user.id,
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          employeeId: `EMP${Date.now()}${Math.floor(Math.random() * 1000)}`,
          department: teacherData.department
        }
      });

      teachers.push(teacher);
      
      console.log(`✅ Created teacher record: ${teacher.firstName} ${teacher.lastName}`);
      console.log(`   Login: ${teacherData.email} / ${teacherData.password}`);

    } catch (error) {
      console.error(`Error creating teacher ${teacherData.email}:`, error);
    }
  }

  // ======================================
  // CREATE STUDENT ACCOUNTS
  // ======================================

  console.log('\n👨‍🎓 Creating student accounts...');

  const studentAccounts = [
    { email: 'alice.johnson@student.school.edu', password: 'student123', firstName: 'Alice', lastName: 'Johnson', grade: '10th Grade' },
    { email: 'bob.chen@student.school.edu', password: 'student123', firstName: 'Bob', lastName: 'Chen', grade: '10th Grade' },
    { email: 'charlie.rodriguez@student.school.edu', password: 'student123', firstName: 'Charlie', lastName: 'Rodriguez', grade: '11th Grade' },
    { email: 'diana.williams@student.school.edu', password: 'student123', firstName: 'Diana', lastName: 'Williams', grade: '11th Grade' },
    { email: 'ethan.brown@student.school.edu', password: 'student123', firstName: 'Ethan', lastName: 'Brown', grade: '9th Grade' }
  ];

  const students = [];

  for (const studentData of studentAccounts) {
    try {
      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: studentData.email,
        password: studentData.password,
        email_confirm: true,
        user_metadata: {
          role: 'STUDENT',
          firstName: studentData.firstName,
          lastName: studentData.lastName
        }
      });

      if (authError) {
        console.error(`Failed to create auth user for ${studentData.email}:`, authError);
        continue;
      }

      // Create corresponding records in Prisma
      const user = await prisma.user.create({
        data: {
          id: authUser.user.id,
          email: studentData.email,
          role: 'STUDENT',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        }
      });

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          studentId: `STU${Date.now()}${Math.floor(Math.random() * 1000)}`,
          gradeLevel: studentData.grade,
          enrollmentDate: new Date()
        }
      });

      students.push(student);
      
      console.log(`✅ Created student: ${student.firstName} ${student.lastName}`);
      console.log(`   Login: ${studentData.email} / ${studentData.password}`);

    } catch (error) {
      console.error(`Error creating student ${studentData.email}:`, error);
    }
  }

  // ======================================
  // CREATE CLASSES AND ENROLLMENTS
  // ======================================

  console.log('\n📚 Creating classes...');
  
  const classes = [];
  for (const teacher of teachers) {
    const classData = [
      {
        classCode: `MATH${teacher.id}01`,
        name: 'Algebra I',
        subject: 'Mathematics',
        teacherId: teacher.id,
        description: 'Introduction to algebraic concepts',
        schoolName: 'MIT Academy',
        academicYear: '2024-2025',
        semester: 'Fall'
      },
      {
        classCode: `MATH${teacher.id}02`,
        name: 'Geometry', 
        subject: 'Mathematics',
        teacherId: teacher.id,
        description: 'Study of shapes and spatial relationships',
        schoolName: 'MIT Academy',
        academicYear: '2024-2025',
        semester: 'Fall'
      }
    ];

    for (const classInfo of classData) {
      const newClass = await prisma.class.create({
        data: classInfo
      });
      classes.push(newClass);
      console.log(`Created class: ${newClass.name} for ${teacher.firstName} ${teacher.lastName}`);
    }
  }

  // Enroll students in classes
  console.log('\n📝 Creating enrollments...');
  let enrollmentCount = 0;
  
  for (const student of students) {
    // Enroll each student in 2-3 random classes
    const numClasses = Math.min(2 + Math.floor(Math.random() * 2), classes.length);
    const selectedClasses = classes.sort(() => 0.5 - Math.random()).slice(0, numClasses);

    for (const classRecord of selectedClasses) {
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

  // Create some sample lessons and AI sessions
  console.log('\n📖 Creating sample data...');
  
  for (const classRecord of classes) {
    // Create lessons
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

  console.log('\n✅ Seeding completed successfully!');
  
  // Print login credentials summary
  console.log('\n🎯 TEST ACCOUNTS CREATED:');
  console.log('\n👨‍🏫 TEACHERS:');
  teacherAccounts.forEach(account => {
    console.log(`   Email: ${account.email}`);
    console.log(`   Password: ${account.password}`);
    console.log(`   Name: ${account.firstName} ${account.lastName}`);
    console.log('   ---');
  });
  
  console.log('\n👨‍🎓 STUDENTS:');
  studentAccounts.forEach(account => {
    console.log(`   Email: ${account.email}`);
    console.log(`   Password: ${account.password}`);
    console.log(`   Name: ${account.firstName} ${account.lastName}`);
    console.log('   ---');
  });

  console.log('\n🔑 All accounts use the same password format for easy testing');
  console.log('Teachers: teacher123 | Students: student123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
