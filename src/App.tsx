import { useEffect, useMemo, useState } from 'react';
import type { AttendanceActions, CurrentUser, Session, Student } from './types';
import { loadUser, saveUser } from './lib/storage';
import {
  addStudent, createSession, deleteSession, deleteStudent,
  markAttendance, subscribeSessions, subscribeStudents, toggleSession,
} from './lib/db';
import { ClipboardIcon } from './components/ui';
import Login from './components/Login';
import ProfessorPanel from './components/professor/ProfessorPanel';
import StudentPanel from './components/student/StudentPanel';

export default function App() {
  const [user, setUser] = useState<CurrentUser | null>(() => loadUser());
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubStudents = subscribeStudents(list => { setStudents(list); setLoading(false); });
    const unsubSessions = subscribeSessions(setSessions);
    return () => { unsubStudents(); unsubSessions(); };
  }, []);

  useEffect(() => {
    if (user?.role === 'student' && !loading && !students.some(s => s.id === user.studentId)) {
      setUser(null);
      saveUser(null);
    }
  }, [students, user, loading]);

  const actions: AttendanceActions = useMemo(() => ({
    addStudent, deleteStudent, createSession, toggleSession, deleteSession, markAttendance,
  }), []);

  const login = (u: CurrentUser) => { setUser(u); saveUser(u); };
  const logout = () => { setUser(null); saveUser(null); };

  if (loading) {
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

  if (!user) return <Login onLogin={login} />;

  if (user.role === 'professor')
    return <ProfessorPanel students={students} sessions={sessions} actions={actions} onLogout={logout} />;

  return <StudentPanel user={user} students={students} sessions={sessions} actions={actions} onLogout={logout} />;
}
