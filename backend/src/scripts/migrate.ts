import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await migrate(drizzle(pool), {
      migrationsFolder: './drizzle',
    });
    console.log('Database migrations completed successfully.');
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Database migration failed:', error);
  process.exitCode = 1;
});
