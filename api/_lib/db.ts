import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from './password.js';
import { schemaStatements, upsertProfessor } from './sql.js';

type Row = Record<string, unknown>;

let client: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

function connectionString(): string {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. Neon را به پروژهٔ Vercel وصل کنید و رشتهٔ اتصال را در .env بگذارید.');
  }
  return url;
}

function clientInstance() {
  client ??= neon(connectionString());
  return client;
}

export async function query<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  const rows = await clientInstance().query(text, params);
  return rows as unknown as T[];
}

/** حساب استاد از متغیرهای محیطی همگام می‌شود؛ رمز هرگز به مرورگر نمی‌رود. */
async function syncProfessor(): Promise<void> {
  const username = process.env.PROFESSOR_USERNAME?.trim().toLowerCase();
  const password = process.env.PROFESSOR_PASSWORD;
  if (!username || !password) return;

  const name = process.env.PROFESSOR_NAME?.trim() || 'استاد درس';
  const { salt, hash } = await hashPassword(password);
  await query(upsertProfessor, [randomUUID(), name, username, hash, salt]);
}

/** ساخت جداول (idempotent) در اولین فراخوانی هر نمونه از تابع سرور. */
export function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    for (const statement of schemaStatements) {
      await query(statement);
    }
    await syncProfessor();
  })().catch(error => {
    schemaReady = null;
    throw error;
  });
  return schemaReady;
}
