import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

/** هش رمز عبور با scrypt؛ نمک در پایگاه داده ذخیره می‌شود. */
export async function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return { salt, hash: derived.toString('hex') };
}

export async function verifyPassword(password: string, salt: string, hash: string): Promise<boolean> {
  const derived = await scrypt(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, 'hex');
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}
