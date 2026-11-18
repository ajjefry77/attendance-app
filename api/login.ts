import { createToken } from './_lib/auth.js';
import { ensureSchema, query } from './_lib/db.js';
import { fail, readObject, send, textValue, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { verifyPassword } from './_lib/password.js';
import { findProfessor, findStudent } from './_lib/sql.js';

interface CredentialRow {
  id: string;
  name: string;
  username: string;
  salt: string;
  pass_hash: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    fail(res, 405, 'method_not_allowed');
    return;
  }

  const body = readObject(req.body);
  const role = textValue(body.role);
  const username = textValue(body.username).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password) {
    fail(res, 400, 'missing_credentials');
    return;
  }
  if (role !== 'professor' && role !== 'student') {
    fail(res, 400, 'invalid_role');
    return;
  }

  try {
    await ensureSchema();

    const [account] = await query<CredentialRow>(role === 'professor' ? findProfessor : findStudent, [username]);
    const valid = account ? await verifyPassword(password, account.salt, account.pass_hash) : false;
    if (!account || !valid) {
      fail(res, 401, 'invalid_credentials');
      return;
    }

    if (role === 'professor') {
      send(res, 200, {
        token: createToken({ sub: account.id, role: 'professor', name: account.name }),
        user: { role: 'professor', name: account.name },
      });
      return;
    }

    send(res, 200, {
      token: createToken({ sub: account.id, role: 'student', name: account.name }),
      user: { role: 'student', studentId: account.id },
    });
  } catch (error) {
    console.error('login failed', error);
    fail(res, 500, 'server_error');
  }
}
