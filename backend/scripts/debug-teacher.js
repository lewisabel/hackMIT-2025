// backend/scripts/debug-teacher-auth.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugTeacherAuth() {
  try {
    console.log('=== DEBUGGING TEACHER AUTHENTICATION ===\n');

    // Find all users with sarah.johnson email
    const users = await prisma.user.findMany({
      where: {
        email: 'sarah.johnson@school.edu'
      },
      include: {
        teacher: {
          include: {
            classes: {
              include: {
                _count: { select: { enrollments: true } }
              }
            }
          }
        }
      }
    });

    console.log(`Found ${users.length} users with email sarah.johnson@school.edu:`);
    
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  User ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Active: ${user.isActive}`);
      console.log(`  Has Teacher Record: ${!!user.teacher}`);
      
      if (user.teacher) {
        console.log(`  Teacher ID: ${user.teacher.id}`);
        console.log(`  Teacher Name: ${user.teacher.firstName} ${user.teacher.lastName}`);
        console.log(`  Classes: ${user.teacher.classes.length}`);
        
        user.teacher.classes.forEach(cls => {
          console.log(`    - ${cls.name}: ${cls._count.enrollments} students`);
        });
      }
    });

    // Check all teachers named Sarah Johnson
    console.log('\n=== ALL SARAH JOHNSON TEACHERS ===');
    const teachers = await prisma.teacher.findMany({
      where: {
        firstName: 'Sarah',
        lastName: 'Johnson'
      },
      include: {
        user: { select: { email: true, id: true } },
        classes: {
          include: {
            _count: { select: { enrollments: true } }
          }
        }
      }
    });

    teachers.forEach(teacher => {
      console.log(`\nTeacher ID: ${teacher.id}`);
      console.log(`User ID: ${teacher.userId}`);
      console.log(`Email: ${teacher.user.email}`);
      console.log(`Classes: ${teacher.classes.length}`);
      
      teacher.classes.forEach(cls => {
        console.log(`  - ${cls.name} (ID: ${cls.id}): ${cls._count.enrollments} students`);
      });
    });

    // Test the API query for each teacher
    console.log('\n=== TESTING API QUERIES ===');
    
    for (const teacher of teachers) {
      console.log(`\nTesting queries for Teacher ID ${teacher.id}:`);
      
      try {
        const totalStudents = await prisma.student.count({
          where: {
            enrollments: {
              some: {
                class: {
                  teacherId: teacher.id
                }
              }
            },
            user: {
              isActive: true
            }
          }
        });

        const totalAssessments = await prisma.assessment.count({
          where: {
            student: {
              enrollments: {
                some: {
                  class: {
                    teacherId: teacher.id
                  }
                }
              }
            }
          }
        });

        const totalSessions = await prisma.aISession.count({
          where: {
            student: {
              enrollments: {
                some: {
                  class: {
                    teacherId: teacher.id
                  }
                }
              }
            }
          }
        });

        console.log(`  Students: ${totalStudents}`);
        console.log(`  Assessments: ${totalAssessments}`);
        console.log(`  AI Sessions: ${totalSessions}`);

      } catch (error) {
        console.log(`  Error querying data: ${error.message}`);
      }
    }

    // Check if the frontend is using the right teacher ID
    console.log('\n=== RECOMMENDATIONS ===');
    
    if (teachers.length === 0) {
      console.log('❌ No Sarah Johnson teacher records found!');
      console.log('   Run the population script again.');
    } else if (teachers.length === 1) {
      const teacher = teachers[0];
      console.log(`✅ Found 1 Sarah Johnson teacher (ID: ${teacher.id})`);
      
      if (teacher.classes.length === 0) {
        console.log('⚠️  Teacher has no classes. Run populate script.');
      } else {
        const totalEnrollments = teacher.classes.reduce((sum, cls) => sum + cls._count.enrollments, 0);
        if (totalEnrollments === 0) {
          console.log('⚠️  Classes exist but no students enrolled. Run populate script.');
        } else {
          console.log('✅ Teacher has classes and students.');
          console.log('🔍 The dashboard should show data. Check:');
          console.log('   1. Is your frontend using the correct teacher ID?');
          console.log('   2. Are your API calls working?');
          console.log('   3. Check browser network tab for API errors');
        }
      }
    } else {
      console.log(`⚠️  Found ${teachers.length} Sarah Johnson teachers!`);
      console.log('   This might cause confusion. Consider consolidating.');
      
      teachers.forEach(teacher => {
        const totalEnrollments = teacher.classes.reduce((sum, cls) => sum + cls._count.enrollments, 0);
        console.log(`   Teacher ID ${teacher.id}: ${totalEnrollments} total student enrollments`);
      });
    }

  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTeacherAuth();