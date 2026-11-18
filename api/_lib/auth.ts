import { createHmac, timingSafeEqual } from 'node:crypto';

export interface TokenPayload {
  sub: string;
  role: 'professor' | 'student';
  name: string;
  exp: number;
}

const DEV_SECRET = 'attendance-dev-only-secret';
const TTL_MS = 14 * 24 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.VERCEL_ENV === 'production' || (!process.env.VERCEL && process.env.NODE_ENV === 'production')) {
    throw new Error('AUTH_SECRET is not configured');
  }
  return DEV_SECRET;
}

const encode = (value: string) => Buffer.from(value, 'utf8').toString('base64url');
const signatureOf = (body: string) => createHmac('sha256', secret()).update(body).digest('base64url');

export function createToken(payload: Omit<TokenPayload, 'exp'>): string {
  const body = encode(JSON.stringify({ ...payload, exp: Date.now() + TTL_MS }));
  return `${body}.${signatureOf(body)}`;
}

export function readToken(token: string | null): TokenPayload | null {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  let expected: Buffer;
  try {
    expected = Buffer.from(signatureOf(body), 'utf8');
  } catch {
    // AUTH_SECRET پیکربندی نشده است؛ به‌جای کرش، توکن نامعتبر حساب می‌شود.
    return null;
  }
  const given = Buffer.from(signature, 'utf8');
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    if (!payload?.sub || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (payload.role !== 'professor' && payload.role !== 'student') return null;
    return payload;
  } catch {
    return null;
  }
}
