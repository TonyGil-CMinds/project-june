import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 keeps the datasource URL here rather than in schema.prisma.
 *
 * Two deliberate choices:
 *  - `dotenv/config`, because the Prisma CLI reads `.env` but not Next's
 *    `.env.local`, so without it the CLI can't see DATABASE_URL.
 *  - plain `process.env`, not `env()` from prisma/config: that helper throws
 *    when the variable is missing, and `postinstall` runs `prisma generate`, so
 *    a fresh clone with no `.env` yet would fail `npm install` outright.
 *    Generating doesn't need a reachable database; migrate and studio do, and
 *    they report a clear error of their own.
 *
 * Note: `prisma install` also drops a `prisma7.config.ts`, and the CLI loads
 * that one in preference to this file. Keep only one — this is the canonical
 * name, so the generated one was removed.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
