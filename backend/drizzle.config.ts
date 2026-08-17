import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const first = process.env.DATABASE_URL;
console.log(first);
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});