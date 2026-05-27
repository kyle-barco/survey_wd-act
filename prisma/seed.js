require('dotenv').config(); // Load environment variables from .env

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Set up the driver adapter using your DATABASE_URL environment variable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pass the adapter directly into the constructor
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@surveyhub.edu' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@surveyhub.edu',
      password,
      role: 'ADMIN',
      phone: '+63 912 000 0000',
      address: 'DepEd Building, Quezon City',
    }
  });

  const teacherPass = await bcrypt.hash('teacher123', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@surveyhub.edu' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'teacher@surveyhub.edu',
      password: teacherPass,
      role: 'TEACHER',
      phone: '+63 917 123 4567',
      address: 'Quezon City, Metro Manila',
    }
  });

  const studentPass = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@surveyhub.edu' },
    update: {},
    create: {
      name: 'Juan dela Cruz',
      email: 'student@surveyhub.edu',
      password: studentPass,
      role: 'STUDENT',
      phone: '+63 921 987 6543',
      address: 'Barangay San Isidro, Quezon City',
    }
  });

  console.log('✅ Seeded:');
  console.log(`   Admin   → admin@surveyhub.edu   / admin123`);
  console.log(`   Teacher → teacher@surveyhub.edu / teacher123`);
  console.log(`   Student → student@surveyhub.edu / student123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());