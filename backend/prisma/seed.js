// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to generate random scores
function randomScore(min = 1, max = 10) {
  return Math.random() * (max - min) + min;
}

// Helper function to generate random date within range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate student IDs
function generateStudentId() {
  return `STU${Math.floor(Math.random() * 90000) + 10000}`;
}

// Helper function to generate employee IDs
function generateEmployeeId() {
  return `EMP${Math.floor(Math.random() * 9000) + 1000}`;
}

// Helper function to generate class codes
function generateClassCode() {
  return `CLS${Math.floor(Math.random() * 9000) + 1000}`;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data in correct order (due to foreign key constraints)
  console.log('🧹 Clearing existing data...');
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

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Teachers
  console.log('👨‍🏫 Creating teachers...');
  const teachers = [];
  const teacherData = [
    { firstName: 'Sarah', lastName: 'Johnson', department: 'Mathematics' },
    { firstName: 'Michael', lastName: 'Chen', department: 'Science' },
    { firstName: 'Emily', lastName: 'Rodriguez', department: 'English' },
    { firstName: 'David', lastName: 'Thompson', department: 'History' },
    { firstName: 'Lisa', lastName: 'Anderson', department: 'Computer Science' }
  ];

  for (const teacher of teacherData) {
    const user = await prisma.user.create({
      data: {
        email: `${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}@school.edu`,
        passwordHash: hashedPassword,
        role: 'TEACHER',
        lastLogin: randomDate(new Date(2024, 11, 1), new Date()),
        isActive: true
      }
    });

    const teacherRecord = await prisma.teacher.create({
      data: {
        userId: user.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        employeeId: generateEmployeeId(),
        department: teacher.department
      }
    });

    teachers.push(teacherRecord);
  }

  // Create Students
  console.log('👨‍🎓 Creating students...');
  const students = [];
  const firstNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah',
    'Ian', 'Julia', 'Kevin', 'Luna', 'Mason', 'Nina', 'Oscar', 'Penny',
    'Quinn', 'Ruby', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier',
    'Yara', 'Zoe', 'Aaron', 'Bella', 'Connor', 'Daphne', 'Elena', 'Felix',
    'Grace', 'Hugo', 'Iris', 'Jack', 'Kara', 'Leo', 'Mia', 'Noah'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  const gradeLevels = ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];

  for (let i = 0; i < 40; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const user = await prisma.user.create({
      data: {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student.school.edu`,
        passwordHash: hashedPassword,
        role: 'STUDENT',
        lastLogin: Math.random() > 0.3 ? randomDate(new Date(2024, 11, 1), new Date()) : null,
        isActive: Math.random() > 0.1 // 90% active
      }
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        firstName: firstName,
        lastName: lastName,
        studentId: generateStudentId(),
        gradeLevel: gradeLevels[Math.floor(Math.random() * gradeLevels.length)],
        enrollmentDate: randomDate(new Date(2024, 7, 1), new Date(2024, 8, 30))
      }
    });

    students.push(student);
  }

  // Create Classes
  console.log('📚 Creating classes...');
  const classes = [];
  const classData = [
    // Math classes
    { name: 'Algebra I', subject: 'Mathematics', teacherId: teachers[0].id, description: 'Introduction to algebraic concepts' },
    { name: 'Geometry', subject: 'Mathematics', teacherId: teachers[0].id, description: 'Study of shapes and spatial relationships' },
    { name: 'Pre-Calculus', subject: 'Mathematics', teacherId: teachers[0].id, description: 'Preparation for calculus' },
    
    // Science classes
    { name: 'Biology', subject: 'Science', teacherId: teachers[1].id, description: 'Study of living organisms' },
    { name: 'Chemistry', subject: 'Science', teacherId: teachers[1].id, description: 'Study of matter and chemical reactions' },
    { name: 'Physics', subject: 'Science', teacherId: teachers[1].id, description: 'Study of matter, energy, and motion' },
    
    // English classes
    { name: 'English Literature', subject: 'English', teacherId: teachers[2].id, description: 'Analysis of literary works' },
    { name: 'Creative Writing', subject: 'English', teacherId: teachers[2].id, description: 'Developing writing skills' },
    
    // History classes
    { name: 'World History', subject: 'History', teacherId: teachers[3].id, description: 'Survey of world civilizations' },
    { name: 'US History', subject: 'History', teacherId: teachers[3].id, description: 'American historical development' },
    
    // Computer Science classes
    { name: 'Intro to Programming', subject: 'Computer Science', teacherId: teachers[4].id, description: 'Basic programming concepts' },
    { name: 'Web Development', subject: 'Computer Science', teacherId: teachers[4].id, description: 'Building web applications' }
  ];

  for (const classInfo of classData) {
    const classRecord = await prisma.class.create({
      data: {
        ...classInfo,
        classCode: generateClassCode(),
        schoolName: 'MIT Academy',
        academicYear: '2024-2025',
        semester: 'Fall',
        schedule: 'MWF 10:00-11:00',
        roomNumber: `Room ${Math.floor(Math.random() * 300) + 100}`
      }
    });
    classes.push(classRecord);
  }

  // Create Enrollments
  console.log('📝 Creating enrollments...');
  for (const student of students) {
    // Each student gets enrolled in 3-5 random classes
    const numClasses = Math.floor(Math.random() * 3) + 3;
    const selectedClasses = classes
      .sort(() => 0.5 - Math.random())
      .slice(0, numClasses);

    for (const classRecord of selectedClasses) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          classId: classRecord.id,
          enrollmentDate: randomDate(new Date(2024, 7, 1), new Date(2024, 8, 30)),
          status: 'ACTIVE'
        }
      });
    }
  }

  // Create Lessons
  console.log('📖 Creating lessons...');
  const lessons = [];
  for (const classRecord of classes) {
    // Each class gets 5-10 lessons
    const numLessons = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 1; i <= numLessons; i++) {
      const lesson = await prisma.lesson.create({
        data: {
          classId: classRecord.id,
          lessonNumber: i,
          title: `${classRecord.name} - Lesson ${i}`,
          description: `Learning objectives for lesson ${i} in ${classRecord.name}`,
          topicsCovered: JSON.stringify([`Topic ${i}A`, `Topic ${i}B`, `Topic ${i}C`]),
          learningObjectives: JSON.stringify([
            `Understand concept ${i}`,
            `Apply knowledge of ${classRecord.subject.toLowerCase()}`,
            `Solve problems related to lesson ${i}`
          ]),
          lessonDate: randomDate(new Date(2024, 8, 1), new Date(2024, 11, 15))
        }
      });
      lessons.push(lesson);
    }
  }

  // Create AI Sessions and Assessments
  console.log('🤖 Creating AI sessions and assessments...');
  const understandingLevels = ['NOVICE', 'DEVELOPING', 'PROFICIENT', 'ADVANCED'];
  const confidenceLevels = ['LOW', 'MEDIUM', 'HIGH'];

  for (const student of students) {
    // Get student's enrollments to find their lessons
    const studentEnrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: { class: { include: { lessons: true } } }
    });

    const availableLessons = studentEnrollments.flatMap(enrollment => 
      enrollment.class.lessons
    );

    // Create 5-15 AI sessions per student
    const numSessions = Math.floor(Math.random() * 11) + 5;
    
    for (let i = 0; i < numSessions; i++) {
      if (availableLessons.length === 0) continue;
      
      const lesson = availableLessons[Math.floor(Math.random() * availableLessons.length)];
      const sessionStart = randomDate(new Date(2024, 8, 1), new Date());
      const durationMinutes = Math.floor(Math.random() * 60) + 15; // 15-75 minutes
      const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);

      const aiSession = await prisma.aISession.create({
        data: {
          studentId: student.id,
          lessonId: lesson.id,
          sessionStart: sessionStart,
          sessionEnd: sessionEnd,
          durationMinutes: durationMinutes,
          transcript: `Student ${student.firstName} worked on ${lesson.title} for ${durationMinutes} minutes.`,
          summary: `Student showed good engagement with the material and asked relevant questions.`,
          status: 'COMPLETED'
        }
      });

      // Create assessment for this session
      const overallScore = randomScore(3, 9.5); // 3-9.5 out of 10
      const understandingLevel = understandingLevels[Math.floor(Math.random() * understandingLevels.length)];

      const assessment = await prisma.assessment.create({
        data: {
          sessionId: aiSession.id,
          studentId: student.id,
          lessonId: lesson.id,
          overallScore: overallScore,
          understandingLevel: understandingLevel,
          strengths: JSON.stringify([
            'Good problem-solving approach',
            'Clear communication',
            'Active engagement'
          ]),
          weaknesses: JSON.stringify([
            'Could improve on fundamentals',
            'Needs more practice with advanced concepts'
          ]),
          aiFeedback: `Great work on this lesson! You scored ${overallScore.toFixed(1)}/10. Keep practicing the areas we discussed.`,
          recommendedResources: JSON.stringify([
            'Practice problems set A',
            'Video tutorial series',
            'Supplementary reading chapter 3'
          ])
        }
      });

      // Create topic assessments
      const topics = JSON.parse(lesson.topicsCovered || '[]');
      for (const topic of topics.slice(0, 3)) { // Max 3 topics per assessment
        await prisma.topicAssessment.create({
          data: {
            assessmentId: assessment.id,
            topicName: topic,
            score: randomScore(2, 10),
            confidenceLevel: confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)],
            specificFeedback: `Good understanding of ${topic}. Continue practicing to improve.`
          }
        });
      }
    }
  }

  // Create Learning Progress
  console.log('📈 Creating learning progress...');
  for (const student of students) {
    const studentEnrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: { class: true }
    });

    for (const enrollment of studentEnrollments) {
      // Create progress entries for the last 30 days
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        
        // Skip some days to make it more realistic
        if (Math.random() > 0.7) continue;

        await prisma.learningProgress.create({
          data: {
            studentId: student.id,
            classId: enrollment.classId,
            date: date,
            averageUnderstanding: randomScore(4, 9),
            topicsMastered: Math.floor(Math.random() * 5) + 1,
            totalTopics: Math.floor(Math.random() * 10) + 5,
            timeSpentMinutes: Math.floor(Math.random() * 120) + 30,
            streakDays: Math.floor(Math.random() * 10)
          }
        });
      }
    }
  }

  console.log('✅ Seeding completed successfully!');
  
  // Print summary
  const userCount = await prisma.user.count();
  const teacherCount = await prisma.teacher.count();
  const studentCount = await prisma.student.count();
  const classCount = await prisma.class.count();
  const enrollmentCount = await prisma.enrollment.count();
  const lessonCount = await prisma.lesson.count();
  const sessionCount = await prisma.aISession.count();
  const assessmentCount = await prisma.assessment.count();
  const topicAssessmentCount = await prisma.topicAssessment.count();
  const progressCount = await prisma.learningProgress.count();

  console.log('\n📊 Seeding Summary:');
  console.log(`Users: ${userCount}`);
  console.log(`Teachers: ${teacherCount}`);
  console.log(`Students: ${studentCount}`);
  console.log(`Classes: ${classCount}`);
  console.log(`Enrollments: ${enrollmentCount}`);
  console.log(`Lessons: ${lessonCount}`);
  console.log(`AI Sessions: ${sessionCount}`);
  console.log(`Assessments: ${assessmentCount}`);
  console.log(`Topic Assessments: ${topicAssessmentCount}`);
  console.log(`Learning Progress Records: ${progressCount}`);
  
  console.log('\n🎯 Test Accounts:');
  console.log('Teachers:');
  teacherData.forEach(teacher => {
    console.log(`  ${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}@school.edu`);
  });
  console.log('Students: alice.smith0@student.school.edu (and 39 others)');
  console.log('Password for all: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });