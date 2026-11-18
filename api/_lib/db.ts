import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from './password.js';
import { schemaStatements, upsertProfessor } from './sql.js';

type Row = Record<string, unknown>;

let client: ReturnType<typeof neon> | null = null;
let schemaReady: Promise<void> | null = null;

const DIRECT_DB_KEYS = ['DATABASE_URL', 'POSTGRES_URL', 'NEON_DATABASE_URL'];

function connectionString(): string {
  for (const key of DIRECT_DB_KEYS) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }

  // اتصال نئون روی Vercel ممکن است با پیشوند پروژه ساخته شود، مثل ATTENDANCE_DATABASE_URL.
  for (const [key, value] of Object.entries(process.env)) {
    if (value && /_(DATABASE|POSTGRES)_URL$/.test(key)) return value.trim();
  }

  throw new Error(
    'رشتهٔ اتصال دیتابیس پیدا نشد. DATABASE_URL را در .env بگذارید یا Neon را به پروژهٔ Vercel وصل کنید.',
  );
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
