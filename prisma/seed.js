const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@webdesa.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@webdesa.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created');
  console.log('📧 Email: admin@webdesa.com');
  console.log('🔒 Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });