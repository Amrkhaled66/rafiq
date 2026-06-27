import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db';
import { users } from '../db';

const SUPER_ADMIN_FULL_NAME = 'Amr Khaled';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const phone = process.env.SUPER_ADMIN_PHONE?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!phone) {
    throw new Error('SUPER_ADMIN_PHONE is not set');
  }

  if (!password) {
    throw new Error('SUPER_ADMIN_PASSWORD is not set');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle({ client: pool, schema });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.phone, phone),
    });

    if (existingUser) {
      await db
        .update(users)
        .set({
          fullName: SUPER_ADMIN_FULL_NAME,
          password: hashedPassword,
          role: 'super_admin',
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));

      return;
    }

    await db.insert(users).values({
      fullName: SUPER_ADMIN_FULL_NAME,
      phone,
      password: hashedPassword,
      role: 'super_admin',
    });

  } finally {
    await pool.end();
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Super admin seed failed: ${message}`);
  process.exitCode = 1;
});
