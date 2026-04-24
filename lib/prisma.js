import { PrismaClient } from '../app/generated/prisma';

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({ log: ['query'] });
}

export const prisma = globalForPrisma.prisma;

export default prisma;
