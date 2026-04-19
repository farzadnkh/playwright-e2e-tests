import process from 'node:process';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DATABASE_DATABASE,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    port: Number.parseInt(process.env.DATABASE_PORT ?? '0'),
    max: 10
  })
});

export const pgsql = new Kysely({
  dialect
});
