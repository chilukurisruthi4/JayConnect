import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma';

const globalForPrisma = global;

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  globalForPrisma.adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({ adapter: globalForPrisma.adapter, log: ['query'] });
}

export const prisma = globalForPrisma.prisma;
export default prisma;
