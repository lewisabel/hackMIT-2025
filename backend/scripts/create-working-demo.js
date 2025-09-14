// backend/scripts/create-working-demo.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createWorkingDemo() {
  try {
    console.log('Creating complete working demo...\n');

    // Clear everything first
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

    // Create teacher user
    const teacherUser = await prisma.user.create({
      data: {
        email: 'demo@teacher.com',
        passwordHash: 'demo123',
        role: 'TEACHER',
        isActive: true,
        lastLogin: new Date()
      }
    });

    // Create teacher record
    const teacher = await prisma.teacher.create({
      data: {
        userId: teacherUser.id,
        firstName: 'Demo',
        lastName: 'Teacher',
        employeeId: 'EMP001',
        department: 'Mathematics'
      }
    });

    console.log(`✅ Created teacher: ${teacher.firstName} ${teacher.lastName} (ID: ${teacher.id})`);

    // Create classes
    const classes = await Promise.all([
      prisma.class.create({
        data: {
          classCode: 'MATH101',
          name: 'Algebra I',
          subject: 'Mathematics',
          teacherId: teacher.id,
          description: 'Introduction to algebra',
          schoolName: 'Demo High School',
          academicYear: '2024-2025',
          semester: 'Fall'
        }
      }),
      prisma.class.create({
        data: {
          classCode: 'MATH102',
          name: 'Geometry',
          subject: 'Mathematics',
          teacherId: teacher.id,
          description: 'Study of geometric shapes',
          schoolName: 'Demo High School',
          academicYear: '2024-2025',
          semester: 'Fall'
        }
      })
    ]);

    console.log(`✅ Created ${classes.length} classes`);

    // Create students with fake data
    const studentNames = [
      ['Alice', 'Johnson'], ['Bob', 'Smith'], ['Charlie', 'Davis'],
      ['Diana', 'Wilson'], ['Emma', 'Brown'], ['Frank', 'Miller'],
      ['Grace', 'Taylor'], ['Henry', 'Anderson'], ['Ivy', 'Thomas'],
      ['Jack', 'Jackson'], ['Katie', 'White'], ['Liam', 'Harris']
    ];

    const students = [];
    for (let i = 0; i < studentNames.length; i++) {
      const [firstName, lastName] = studentNames[i];
      
      const user = await prisma.user.create({
        data: {
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.demo.com`,
          passwordHash: 'student123',
          role: 'STUDENT',
          isActive: true,
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random login in last 7 days
        }
      });

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          studentId: `STU${1000 + i}`,
          gradeLevel: ['9th Grade', '10th Grade', '11th Grade'][Math.floor(Math.random() * 3)],
          enrollmentDate: new Date()
        }
      });

      students.push(student);
    }

    console.log(`✅ Created ${students.length} students`);

    // Enroll students in classes
    let enrollmentCount = 0;
    for (const student of students) {
      // Each student in 1-2 classes
      const numClasses = Math.random() > 0.5 ? 2 : 1;
      const selectedClasses = classes.sort(() => 0.5 - Math.random()).slice(0, numClasses);
      
      for (const cls of selectedClasses) {
        await prisma.enrollment.create({
          data: {
            studentId: student.id,
            classId: cls.id,
            enrollmentDate: new Date(),
            status: 'ACTIVE'
          }
        });
        enrollmentCount++;
      }
    }

    console.log(`✅ Created ${enrollmentCount} enrollments`);

    // Create lessons
    const lessons = [];
    for (const cls of classes) {
      for (let i = 1; i <= 4; i++) {
        const lesson = await prisma.lesson.create({
          data: {
            classId: cls.id,
            lessonNumber: i,
            title: `${cls.name} - Lesson ${i}`,
            description: `Learning objectives for lesson ${i}`,
            topicsCovered: JSON.stringify([`Topic ${i}A`, `Topic ${i}B`]),
            learningObjectives: JSON.stringify([`Understand ${cls.name} concepts`]),
            lessonDate: new Date()
          }
        });
        lessons.push(lesson);
      }
    }

    console.log(`✅ Created ${lessons.length} lessons`);

    // Create AI sessions and assessments with realistic fake data
    let sessionCount = 0;
    let assessmentCount = 0;

    for (const student of students) {
      const numSessions = Math.floor(Math.random() * 6) + 3; // 3-8 sessions per student
      
      for (let i = 0; i < numSessions; i++) {
        const lesson = lessons[Math.floor(Math.random() * lessons.length)];
        const duration = Math.floor(Math.random() * 45) + 15; // 15-60 minutes
        const sessionStart = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000); // Last 14 days
        
        const session = await prisma.aISession.create({
          data: {
            studentId: student.id,
            lessonId: lesson.id,
            sessionStart,
            sessionEnd: new Date(sessionStart.getTime() + duration * 60000),
            durationMinutes: duration,
            transcript: `AI tutoring session for ${student.firstName}`,
            summary: `Student worked on ${lesson.title}`,
            status: 'COMPLETED'
          }
        });

        sessionCount++;

        // Create assessment
        const score = Math.random() * 4 + 5; // Score between 5-9
        const understandingLevels = ['DEVELOPING', 'PROFICIENT', 'ADVANCED'];
        
        await prisma.assessment.create({
          data: {
            sessionId: session.id,
            studentId: student.id,
            lessonId: lesson.id,
            overallScore: score,
            understandingLevel: understandingLevels[Math.floor(Math.random() * 3)],
            strengths: JSON.stringify(['Problem solving', 'Communication']),
            weaknesses: JSON.stringify(['Speed', 'Accuracy']),
            aiFeedback: `Good work! Score: ${score.toFixed(1)}/10`
          }
        });

        assessmentCount++;
      }
    }

    console.log(`✅ Created ${sessionCount} AI sessions`);
    console.log(`✅ Created ${assessmentCount} assessments`);

    // Create learning progress
    for (const student of students) {
      const studentClasses = await prisma.enrollment.findMany({
        where: { studentId: student.id }
      });

      for (const enrollment of studentClasses) {
        for (let day = 0; day < 10; day++) {
          const date = new Date();
          date.setDate(date.getDate() - day);
          
          if (Math.random() > 0.4) { // Skip some days
            await prisma.learningProgress.create({
              data: {
                studentId: student.id,
                classId: enrollment.classId,
                date,
                averageUnderstanding: Math.random() * 4 + 5, // 5-9
                topicsMastered: Math.floor(Math.random() * 3) + 1,
                totalTopics: 5,
                timeSpentMinutes: Math.floor(Math.random() * 60) + 30,
                streakDays: Math.floor(Math.random() * 5)
              }
            });
          }
        }
      }
    }

    console.log(`✅ Created learning progress records`);

    // Final summary
    console.log('\n🎉 DEMO SETUP COMPLETE!\n');
    console.log('Login credentials:');
    console.log(`Email: demo@teacher.com`);
    console.log(`Password: demo123`);
    console.log(`Teacher ID: ${teacher.id}`);
    console.log('\nData created:');
    console.log(`- ${students.length} students`);
    console.log(`- ${classes.length} classes`);
    console.log(`- ${sessionCount} AI sessions`);
    console.log(`- ${assessmentCount} assessments`);

  } catch (error) {
    console.error('Error creating demo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createWorkingDemo();