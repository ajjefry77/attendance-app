import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AttendanceActions, CurrentUser, LoginResult, Session, Student } from './types';
import { loadToken, loadUser, saveToken, saveUser } from './lib/storage';
import {
  ApiError, createSession, createStudent, fetchState, markAttendance,
  removeSession, removeStudent, setSessionActive,
} from './lib/api';
import { ClipboardIcon } from './components/ui';
import Login from './components/Login';
import ProfessorPanel from './components/professor/ProfessorPanel';
import StudentPanel from './components/student/StudentPanel';

const SYNC_INTERVAL_MS = 4000;

export default function App() {
  const [user, setUser] = useState<CurrentUser | null>(() => loadUser());
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    saveUser(null);
    saveToken(null);
    setStudents([]);
    setSessions([]);
  }, []);

  const refresh = useCallback(async () => {
    const snapshot = await fetchState();
    setStudents([...snapshot.students].sort((a, b) => a.name.localeCompare(b.name, 'fa')));
    setSessions([...snapshot.sessions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);

  // همگام‌سازی دوره‌ای جایگزین onSnapshot فایربیس شده است.
  useEffect(() => {
    if (!user || !loadToken()) {
      setLoading(false);
      if (user) logout();
      return;
    }

    let cancelled = false;
    let inFlight = false;

    const pull = async () => {
      if (cancelled || inFlight) return;
      inFlight = true;
      try {
        await refresh();
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) logout();
      } finally {
        inFlight = false;
        if (!cancelled) setLoading(false);
      }
    };

    void pull();
    const timer = window.setInterval(pull, SYNC_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [user, refresh, logout]);

  useEffect(() => {
    if (user?.role === 'student' && !loading && !students.some(s => s.id === user.studentId)) logout();
  }, [students, user, loading, logout]);

  const run = useCallback(async (task: () => Promise<unknown>) => {
    await task();
    await refresh();
  }, [refresh]);

  const actions: AttendanceActions = useMemo(() => ({
    addStudent: (name, username, password) => run(() => createStudent(name, username, password)),
    deleteStudent: id => run(() => removeStudent(id)),
    createSession: (title, code) => run(() => createSession(title, code)),
    toggleSession: (id, active) => run(() => setSessionActive(id, active)),
    deleteSession: id => run(() => removeSession(id)),
    markAttendance: (sessionId, code) => run(() => markAttendance(sessionId, code)),
  }), [run]);

  const handleLogin = (result: LoginResult) => {
    saveToken(result.token);
    saveUser(result.user);
    setUser(result.user);
  };

  if (loading && user) {
    return (
      <div className="bg-paper grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-5">
          <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-petrol-900 text-saffron-300 shadow-xl shadow-petrol-900/20">
            <ClipboardIcon className="h-8 w-8 animate-pulse-soft" />
            <span className="absolute -bottom-1 -end-1 h-3.5 w-3.5 animate-ping rounded-full bg-saffron-400" />
          </span>
          <p className="font-display text-2xl text-petrol-950">در حال اتصال به کلاس…</p>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-petrol-700" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-saffron-500" style={{ animationDelay: '120ms' }} />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-petrol-700" style={{ animationDelay: '240ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  if (user.role === 'professor')
    return <ProfessorPanel students={students} sessions={sessions} actions={actions} onLogout={logout} />;

  return <StudentPanel user={user} students={students} sessions={sessions} actions={actions} onLogout={logout} />;
}
