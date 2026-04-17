import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit due to Next.js Hot Module Replacement.
const globalForPrisma = global;

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter, log: ['query'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
