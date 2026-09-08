import { PrismaClient } from '../generated/prisma/client';

/**
 * Every PrismaClient opens its own connection pool, and Next's dev server
 * re-evaluates modules on each hot reload — without this cache that would leak
 * a new pool per reload until Postgres refuses connections. In production the
 * module is evaluated once per serverless instance, so the global is harmless.
 */
const globalForPrisma = globalThis;

/**
 * Prisma Postgres hands out two connection string shapes and they need
 * different drivers, so pick from the scheme instead of pinning one:
 *
 *   prisma+postgres://…  the serverless driver — what `prisma postgres link`
 *                        writes, and what edge runtimes require
 *   postgres://…         direct TCP (db.prisma.io:5432, or any other Postgres
 *                        such as Neon/Supabase, or the local `prisma dev`)
 *
 * Accepting both means the app works whichever URL ends up in .env.
 */
async function createAdapter(connectionString) {
  if (connectionString.startsWith('prisma+postgres://')) {
    const { PrismaPostgresAdapter } = await import('@prisma/adapter-ppg');
    return new PrismaPostgresAdapter({ connectionString });
  }

  const { PrismaPg } = await import('@prisma/adapter-pg');
  return new PrismaPg({ connectionString });
}

async function createClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Run `npx prisma postgres link` to connect a Prisma Postgres database, ' +
        'or `npx prisma dev` for a local one.'
    );
  }

  return new PrismaClient({ adapter: await createAdapter(connectionString) });
}

export async function getPrisma() {
  if (!globalForPrisma.__naturatechPrisma) {
    // Cache the promise, not the resolved client: two concurrent requests on a
    // cold start would otherwise each build their own pool.
    globalForPrisma.__naturatechPrisma = createClient();
  }
  return globalForPrisma.__naturatechPrisma;
}
