// backend/scripts/populate-teacher-data.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function randomScore(min = 1, max = 10) {
  return Math.random() * (max - min) + min;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function populateTeacherData() {
  const TEACHER_ID = 9; // Sarah Johnson's teacher ID

  try {
    console.log(`Populating data for Teacher ID ${TEACHER_ID}...`);

    // Get teacher's classes
    const classes = await prisma.class.findMany({
      where: { teacherId: TEACHER_ID }
    });

    if (classes.length === 0) {
      console.log('No classes found for this teacher');
      return;
    }

    console.log(`Found ${classes.length} classes`);

    // Create more students
    console.log('Creating additional students...');
    const studentData = [
      { firstName: 'Alex', lastName: 'Chen', grade: '10th Grade' },
      { firstName: 'Maya', lastName: 'Patel', grade: '10th Grade' },
      { firstName: 'Jordan', lastName: 'Williams', grade: '11th Grade' },
      { firstName: 'Emma', lastName: 'Davis', grade: '10th Grade' },
      { firstName: 'Liam', lastName: 'Rodriguez', grade: '11th Grade' },
      { firstName: 'Zoe', lastName: 'Thompson', grade: '9th Grade' },
      { firstName: 'Noah', lastName: 'Martinez', grade: '10th Grade' },
      { firstName: 'Ava', lastName: 'Lopez', grade: '11th Grade' }
    ];

    const students = [];
    for (const student of studentData) {
      // Create user first
      const user = await prisma.user.create({
        data: {
          email: `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@student.school.edu`,
          passwordHash: 'supabase_auth',
          role: 'STUDENT',
          isActive: true,
          lastLogin: randomDate(new Date(2024, 10, 1), new Date())
        }
      });

      // Create student record
      const studentRecord = await prisma.student.create({
        data: {
          userId: user.id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentId: `STU${Date.now()}${Math.floor(Math.random() * 1000)}`,
          gradeLevel: student.grade,
          enrollmentDate: randomDate(new Date(2024, 7, 1), new Date(2024, 8, 30))
        }
      });

      students.push(studentRecord);
      console.log(`Created student: ${student.firstName} ${student.lastName}`);
    }

    // Enroll students in classes
    console.log('Enrolling students in classes...');
    let enrollmentCount = 0;
    
    for (const student of students) {
      // Each student enrolls in 1-2 classes
      const numClasses = Math.floor(Math.random() * 2) + 1;
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

    console.log(`Created ${enrollmentCount} enrollments`);

    // Create lessons for each class
    console.log('Creating lessons...');
    const lessons = [];
    
    for (const classRecord of classes) {
      for (let i = 1; i <= 5; i++) {
        const lesson = await prisma.lesson.create({
          data: {
            classId: classRecord.id,
            lessonNumber: i,
            title: `${classRecord.name} - Lesson ${i}`,
            description: `Learning objectives for lesson ${i}`,
            topicsCovered: JSON.stringify([`Topic ${i}A`, `Topic ${i}B`, `Topic ${i}C`]),
            learningObjectives: JSON.stringify([
              `Understand concept ${i}`,
              `Apply knowledge practically`,
              `Solve problems related to lesson ${i}`
            ]),
            lessonDate: randomDate(new Date(2024, 8, 1), new Date())
          }
        });
        lessons.push(lesson);
      }
    }

    console.log(`Created ${lessons.length} lessons`);

    // Create AI sessions and assessments
    console.log('Creating AI sessions and assessments...');
    const allStudents = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            class: {
              teacherId: TEACHER_ID
            }
          }
        }
      }
    });

    let sessionCount = 0;
    let assessmentCount = 0;

    for (const student of allStudents) {
      // Create 3-8 AI sessions per student
      const numSessions = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < numSessions; i++) {
        const lesson = lessons[Math.floor(Math.random() * lessons.length)];
        const sessionStart = randomDate(new Date(2024, 9, 1), new Date());
        const durationMinutes = Math.floor(Math.random() * 60) + 20;
        const sessionEnd = new Date(sessionStart.getTime() + durationMinutes * 60000);

        const aiSession = await prisma.aISession.create({
          data: {
            studentId: student.id,
            lessonId: lesson.id,
            sessionStart: sessionStart,
            sessionEnd: sessionEnd,
            durationMinutes: durationMinutes,
            transcript: `AI tutoring session for ${lesson.title}`,
            summary: `Student worked on ${lesson.title} concepts`,
            status: 'COMPLETED'
          }
        });

        sessionCount++;

        // Create assessment for this session
        const overallScore = randomScore(4, 9.5);
        const understandingLevels = ['NOVICE', 'DEVELOPING', 'PROFICIENT', 'ADVANCED'];

        const assessment = await prisma.assessment.create({
          data: {
            sessionId: aiSession.id,
            studentId: student.id,
            lessonId: lesson.id,
            overallScore: overallScore,
            understandingLevel: understandingLevels[Math.floor(Math.random() * understandingLevels.length)],
            strengths: JSON.stringify([
              'Good problem-solving approach',
              'Clear communication',
              'Active engagement'
            ]),
            weaknesses: JSON.stringify([
              'Could improve on fundamentals',
              'Needs more practice with advanced concepts'
            ]),
            aiFeedback: `Great work! You scored ${overallScore.toFixed(1)}/10.`,
            recommendedResources: JSON.stringify([
              'Practice problems set A',
              'Video tutorial series'
            ])
          }
        });

        assessmentCount++;

        // Create topic assessments
        const topics = ['Algebra Basics', 'Problem Solving', 'Mathematical Reasoning'];
        for (let j = 0; j < 2; j++) {
          const topic = topics[j];
          await prisma.topicAssessment.create({
            data: {
              assessmentId: assessment.id,
              topicName: topic,
              score: randomScore(3, 10),
              confidenceLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
              specificFeedback: `Good understanding of ${topic}`
            }
          });
        }
      }
    }

    console.log(`Created ${sessionCount} AI sessions`);
    console.log(`Created ${assessmentCount} assessments`);

    // Create learning progress
    console.log('Creating learning progress records...');
    for (const student of allStudents) {
      const studentClasses = await prisma.enrollment.findMany({
        where: { studentId: student.id },
        include: { class: true }
      });

      for (const enrollment of studentClasses) {
        // Create progress for last 14 days
        for (let day = 0; day < 14; day++) {
          const date = new Date();
          date.setDate(date.getDate() - day);

          // Skip some days randomly
          if (Math.random() > 0.6) continue;

          await prisma.learningProgress.create({
            data: {
              studentId: student.id,
              classId: enrollment.classId,
              date: date,
              averageUnderstanding: randomScore(5, 9),
              topicsMastered: Math.floor(Math.random() * 3) + 1,
              totalTopics: Math.floor(Math.random() * 5) + 3,
              timeSpentMinutes: Math.floor(Math.random() * 90) + 30,
              streakDays: Math.floor(Math.random() * 7)
            }
          });
        }
      }
    }

    // Final summary
    const summary = await Promise.all([
      prisma.student.count({ where: { enrollments: { some: { class: { teacherId: TEACHER_ID } } } } }),
      prisma.assessment.count({ where: { student: { enrollments: { some: { class: { teacherId: TEACHER_ID } } } } } }),
      prisma.aISession.count({ where: { student: { enrollments: { some: { class: { teacherId: TEACHER_ID } } } } } })
    ]);

    console.log('\n✅ Data population complete!');
    console.log(`Total students: ${summary[0]}`);
    console.log(`Total assessments: ${summary[1]}`);
    console.log(`Total AI sessions: ${summary[2]}`);
    console.log('\nRefresh your dashboard to see the new data!');

  } catch (error) {
    console.error('Error populating data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateTeacherData();