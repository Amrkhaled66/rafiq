import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
import * as schema from './index';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = 'db';
export type Database = NodePgDatabase<typeof schema>;

@Module({
  providers: [
    {
      provide: db,
      useValue: drizzle({ client: pool, schema }),
    },
  ],
  exports: [db],
})
export class DbModule {}
