const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst({ where: { email: 'chilukurisruthi4@gmail.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        adUsername: 'schilukuri',
        fullName: 'Sruthi Chilukuri',
        email: 'chilukurisruthi4@gmail.com',
        role: 'Student · M.S. Computer Information Technology',
        bio: 'Building the future of JayConnect!',
        avatarUrl: null
      }
    });
    console.log('Seeded mock user:', user.fullName);
  } else {
    console.log('User already exists:', user.fullName);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
