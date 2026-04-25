import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  globalForPrisma.adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({ adapter: globalForPrisma.adapter, log: ['query'] });
}

export const prisma = globalForPrisma.prisma;
export default prisma;
