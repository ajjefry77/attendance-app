import { randomUUID } from 'node:crypto';
import { readToken } from './_lib/auth.js';
import { ensureSchema, query } from './_lib/db.js';
import { bearerToken, fail, readObject, send, textValue, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { deleteSession, insertSession, setSessionActive } from './_lib/sql.js';

const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

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
      const title = textValue(body.title);
      const code = textValue(body.code).toUpperCase();

      if (!title) {
        fail(res, 400, 'missing_title');
        return;
      }
      if (!/^[A-Z0-9]{3,24}$/.test(code)) {
        fail(res, 400, 'invalid_code');
        return;
      }

      await query(insertSession, [randomUUID(), title.slice(0, 120), code, todayISO()]);
      send(res, 201, { ok: true });
      return;
    }

    if (req.method === 'PATCH') {
      const body = readObject(req.body);
      const id = textValue(body.id);
      const active = body.active === true;
      if (!id) {
        fail(res, 400, 'missing_id');
        return;
      }
      await query(setSessionActive, [id, active]);
      send(res, 200, { ok: true });
      return;
    }

    if (req.method === 'DELETE') {
      const id = textValue(readObject(req.body).id) || textValue(req.query?.id);
      if (!id) {
        fail(res, 400, 'missing_id');
        return;
      }
      await query(deleteSession, [id]);
      send(res, 200, { ok: true });
      return;
    }

    fail(res, 405, 'method_not_allowed');
  } catch (error) {
    console.error('sessions failed', error);
    fail(res, 500, 'server_error');
  }
}
