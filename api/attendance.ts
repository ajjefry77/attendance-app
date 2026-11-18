import { readToken } from './_lib/auth.js';
import { ensureSchema, query } from './_lib/db.js';
import { bearerToken, fail, readObject, send, textValue, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { countAttendance, findSession, insertAttendance } from './_lib/sql.js';

interface SessionRow {
  id: string;
  code: string;
  active: boolean;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    fail(res, 405, 'method_not_allowed');
    return;
  }

  const auth = readToken(bearerToken(req));
  if (!auth || auth.role !== 'student') {
    fail(res, 401, 'unauthorized');
    return;
  }

  const body = readObject(req.body);
  const sessionId = textValue(body.sessionId);
  const code = textValue(body.code).toUpperCase();
  if (!sessionId || !code) {
    fail(res, 400, 'missing_fields');
    return;
  }

  try {
    await ensureSchema();

    const [session] = await query<SessionRow>(findSession, [sessionId]);
    if (!session) {
      fail(res, 404, 'session_not_found');
      return;
    }
    if (!session.active) {
      fail(res, 403, 'session_closed');
      return;
    }
    if (session.code.toUpperCase() !== code) {
      fail(res, 403, 'invalid_code');
      return;
    }

    await query(insertAttendance, [sessionId, auth.sub]);
    const [count] = await query<{ present: number }>(countAttendance, [sessionId]);
    send(res, 200, { ok: true, presentCount: count?.present ?? 0 });
  } catch (error) {
    console.error('attendance failed', error);
    fail(res, 500, 'server_error');
  }
}
