const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create test teacher
  const teacher = await prisma.user.create({
    data: {
      email: 'prof.smith@school.edu',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'TEACHER',
      teacher: {
        create: {
          firstName: 'John',
          lastName: 'Smith',
          employeeId: 'EMP001',
          department: 'Mathematics'
        }
      }
    }
  });

  // Create test student
  const student = await prisma.user.create({
    data: {
      email: 'student1@school.edu',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'STUDENT',
      student: {
        create: {
          firstName: 'Jane',
          lastName: 'Doe',
          studentId: 'STU001',
          gradeLevel: '10'
        }
      }
    }
  });

  console.log('Seed data created!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());