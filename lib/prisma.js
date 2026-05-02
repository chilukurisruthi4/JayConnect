import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // Keep connections alive so PostgreSQL doesn't drop them
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    // Automatically discard connections idle for >30s (before PostgreSQL times them out)
    idleTimeoutMillis: 30000,
    // How long to wait for a new connection
    connectionTimeoutMillis: 10000,
    // Pool size
    max: 10,
  });

  // Log pool errors instead of crashing
  globalForPrisma.pool.on('error', (err) => {
    console.error('PostgreSQL pool error (will auto-reconnect):', err.message);
  });

  globalForPrisma.adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({ adapter: globalForPrisma.adapter });
}

export const prisma = globalForPrisma.prisma;
export default prisma;
