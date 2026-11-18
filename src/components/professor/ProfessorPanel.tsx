import { useMemo, useState } from 'react';
import type { AttendanceActions, Session, Student } from '../../types';
import { formatJalali, todayISO, toFa } from '../../lib/utils';
import { CalendarIcon, CheckIcon, ClipboardIcon, LogOutIcon, StatCard, ToastHost, UsersIcon, XIcon } from '../ui';
import { useToast } from '../useToast';
import SessionsTab from './SessionsTab';
import ReportTab from './ReportTab';
import StudentsTab from './StudentsTab';

type TabId = 'sessions' | 'report' | 'students';

interface Props {
  students: Student[];
  sessions: Session[];
  actions: AttendanceActions;
  name: string;
  onLogout: () => void;
}

export default function ProfessorPanel({ students, sessions, actions, name, onLogout }: Props) {
  const [tab, setTab] = useState<TabId>('sessions');
  const { toasts, push } = useToast();

  const today = todayISO();
  const todaySessions = useMemo(() => sessions.filter(s => s.date === today), [sessions, today]);
  const presentToday = useMemo(() => {
    const ids = new Set<string>();
    todaySessions.forEach(s => s.attendees.forEach(a => ids.add(a.studentId)));
    return ids.size;
  }, [todaySessions]);
  const absentToday = Math.max(0, students.length - presentToday);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'sessions', label: 'جلسات' },
    { id: 'report', label: 'حاضرین و غایبین' },
    { id: 'students', label: 'دانشجویان' },
  ];

  return (
    <div className="bg-paper min-h-screen pb-16">
      <header className="sticky top-0 z-40 border-b-4 border-saffron-400 bg-petrol-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-saffron-400 text-petrol-950 shadow-md">
              <ClipboardIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-xl leading-none">پنل استاد</h1>
              <p className="mt-1.5 text-[11px] text-white/55">{name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-bold text-emerald-300 md:flex">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-300" />
              همگام‌سازی زنده
            </span>
            <span className="hidden items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white/80 sm:flex">
              <CalendarIcon className="h-4 w-4 text-saffron-300" />
              {formatJalali(today)}
            </span>
            <button onClick={onLogout}
              className="group flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/85 transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-500/20 hover:text-rose-200">
              <LogOutIcon className="h-4 w-4 -scale-x-100 transition-transform duration-300 group-hover:-translate-x-0.5" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={<UsersIcon />} label="دانشجویان" value={toFa(students.length)} tone="petrol" delay={0} />
          <StatCard icon={<CalendarIcon />} label="جلسات امروز" value={toFa(todaySessions.length)} tone="saffron" delay={80} />
          <StatCard icon={<CheckIcon />} label="حاضرین امروز" value={toFa(presentToday)} tone="green" delay={160} />
          <StatCard icon={<XIcon />} label="غایبین امروز" value={toFa(absentToday)} tone="rose" delay={240} />
        </section>

        <nav className="mt-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border border-petrol-900/10 bg-white p-1.5 shadow-sm">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300 ${tab === t.id ? 'bg-petrol-900 text-white shadow-md' : 'text-petrol-950/55 hover:bg-petrol-50 hover:text-petrol-950'}`}>
              {t.label}
            </button>
          ))}
        </nav>

        <div key={tab} className="animate-fade-in mt-6">
          {tab === 'sessions' && <SessionsTab sessions={sessions} actions={actions} push={push} />}
          {tab === 'report' && <ReportTab sessions={sessions} students={students} />}
          {tab === 'students' && <StudentsTab students={students} sessions={sessions} actions={actions} push={push} />}
        </div>
      </main>

      <ToastHost toasts={toasts} />
    </div>
  );
}
