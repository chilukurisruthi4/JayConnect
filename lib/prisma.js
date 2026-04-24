import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit due to Next.js Hot Module Replacement.
const globalForPrisma = global;

const connectionString = process.env.DATABASE_URL;

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ connectionString });
  globalForPrisma.adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({ adapter: globalForPrisma.adapter, log: ['query'] });
}

export const prisma = globalForPrisma.prisma;

export default prisma;
