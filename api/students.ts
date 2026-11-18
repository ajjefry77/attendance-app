import { randomUUID } from 'node:crypto';
import { readToken } from './_lib/auth.js';
import { ensureSchema, query } from './_lib/db.js';
import { bearerToken, fail, readObject, send, textValue, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { hashPassword } from './_lib/password.js';
import { deleteStudent as deleteStudentSql, insertStudent } from './_lib/sql.js';

function isDuplicate(error: unknown): boolean {
  return error instanceof Error && /duplicate key|unique constraint/i.test(error.message);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const auth = readToken(bearerToken(req));
  if (!auth || auth.role !== 'professor') {
    fail(res, 401, 'unauthorized');
    return;
  }

  try {
    await ensureSchema();

    if (req.method === 'POST') {
      const body = readObject(req.body);
      const name = textValue(body.name);
      const username = textValue(body.username).toLowerCase();
      const password = typeof body.password === 'string' ? body.password : '';

      if (!name || !username || !password) {
        fail(res, 400, 'missing_fields');
        return;
      }
      if (password.length < 6) {
        fail(res, 400, 'weak_password');
        return;
      }
      if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
        fail(res, 400, 'invalid_username');
        return;
      }

      const { salt, hash } = await hashPassword(password);
      try {
        await query(insertStudent, [randomUUID(), name, username, hash, salt]);
      } catch (error) {
        if (isDuplicate(error)) {
          fail(res, 409, 'username_taken');
          return;
        }
        throw error;
      }
      send(res, 201, { ok: true });
      return;
    }

    if (req.method === 'DELETE') {
      const id = textValue(readObject(req.body).id) || textValue(req.query?.id);
      if (!id) {
        fail(res, 400, 'missing_id');
        return;
      }
      await query(deleteStudentSql, [id]);
      send(res, 200, { ok: true });
      return;
    }

    fail(res, 405, 'method_not_allowed');
  } catch (error) {
    console.error('students failed', error);
    fail(res, 500, 'server_error');
  }
}
