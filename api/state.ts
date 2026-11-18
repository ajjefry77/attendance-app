import { readToken } from './_lib/auth.js';
import { ensureSchema, query } from './_lib/db.js';
import { bearerToken, fail, send, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { listAttendance, listSessions, listStudents } from './_lib/sql.js';

interface StudentRow {
  id: string;
  name: string;
  username: string;
  created_at: string;
}

interface SessionRow {
  id: string;
  title: string;
  code: string;
  session_date: string;
  active: boolean;
  created_at: string;
}

interface AttendanceRow {
  session_id: string;
  student_id: string;
  student_name: string;
  marked_at: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    fail(res, 405, 'method_not_allowed');
    return;
  }

  const auth = readToken(bearerToken(req));
  if (!auth) {
    fail(res, 401, 'unauthorized');
    return;
  }

  try {
    await ensureSchema();

    const [students, sessionRows, attendance] = await Promise.all([
      query<StudentRow>(listStudents),
      query<SessionRow>(listSessions),
      query<AttendanceRow>(listAttendance),
    ]);

    const isProfessor = auth.role === 'professor';
    const visibleStudents = isProfessor
      ? students.map(row => ({
          id: row.id,
          name: row.name,
          username: row.username,
          createdAt: row.created_at,
        }))
      : students
          .filter(row => row.id === auth.sub)
          .map(row => ({ id: row.id, name: row.name, username: row.username, createdAt: row.created_at }));

    const sessions = sessionRows.map(row => ({
      id: row.id,
      title: row.title,
      // کد جلسه فقط برای استاد آشکار می‌شود؛ بررسی آن هم سمت سرور انجام می‌شود.
      code: isProfessor ? row.code : '',
      date: row.session_date,
      active: row.active,
      createdAt: row.created_at,
      presentCount: 0,
      attendees: [] as { studentId: string; name: string; time: string }[],
    }));

    const byId = new Map(sessions.map(session => [session.id, session]));
    for (const record of attendance) {
      const session = byId.get(record.session_id);
      if (!session) continue;
      session.presentCount += 1;
      if (isProfessor || record.student_id === auth.sub) {
        session.attendees.push({
          studentId: record.student_id,
          name: record.student_name,
          time: record.marked_at,
        });
      }
    }

    send(res, 200, { students: visibleStudents, sessions });
  } catch (error) {
    console.error('state failed', error);
    fail(res, 500, 'server_error');
  }
}
