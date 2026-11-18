import { useState } from 'react';
import type { Session, Student } from '../../types';
import { formatJalali, formatTime, toFa } from '../../lib/utils';
import { CheckIcon, ClockIcon, EmptyState, UsersIcon, XIcon } from '../ui';

export default function ReportTab({ sessions, students }: { sessions: Session[]; students: Student[] }) {
  const [selectedId, setSelectedId] = useState<string>(sessions[0]?.id ?? '');
  const session = sessions.find(s => s.id === selectedId) ?? sessions[0];

  if (!session)
    return <EmptyState icon={<UsersIcon className="h-6 w-6" />} title="گزارشی موجود نیست" sub="ابتدا یک جلسه ایجاد کنید تا گزارش حضور نمایش داده شود." />;

  const presentIds = new Set(session.attendees.map(a => a.studentId));
  const absentees = students.filter(st => !presentIds.has(st.id));
  const percent = students.length ? Math.round((session.presentCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sessions.map(s => (
          <button key={s.id} onClick={() => setSelectedId(s.id)}
            className={`shrink-0 rounded-lg border px-4 py-2.5 text-sm transition-all duration-300 ${s.id === session.id ? 'border-petrol-900 bg-petrol-900 text-white shadow-md' : 'border-petrol-900/10 bg-white text-petrol-950/70 hover:-translate-y-0.5 hover:border-petrol-300 hover:text-petrol-950'}`}>
            <span className="font-bold">{s.title}</span>
            <span className="ms-2.5 text-[11px] opacity-60">{formatJalali(s.date, { day: 'numeric', month: 'long' })}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="animate-fade-up rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">حاضر</span>
            <CheckIcon className="h-5 w-5 text-emerald-500" strokeWidth={2.6} />
          </div>
          <p className="mt-2 font-display text-4xl text-emerald-700">{toFa(session.presentCount)}</p>
          <p className="mt-1 text-[11px] text-emerald-700/60">از {toFa(students.length)} دانشجو</p>
        </div>

        <div className="animate-fade-up rounded-xl border border-rose-200 bg-rose-50 p-5" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600">غایب</span>
            <XIcon className="h-5 w-5 text-rose-400" strokeWidth={2.6} />
          </div>
          <p className="mt-2 font-display text-4xl text-rose-600">{toFa(absentees.length)}</p>
          <p className="mt-1 text-[11px] text-rose-600/60">نفر در این جلسه</p>
        </div>

        <div className="animate-fade-up rounded-xl border border-petrol-900/10 bg-white p-5" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-petrol-950/60">درصد حضور</span>
            <span className="font-display text-2xl text-saffron-600">{toFa(percent)}٪</span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-petrol-100">
            <div className="h-full rounded-full bg-gradient-to-l from-saffron-400 to-emerald-500 transition-all duration-700 ease-out" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="animate-fade-up overflow-hidden rounded-xl border border-petrol-900/10 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-petrol-900/10 bg-petrol-50/60 px-5 py-3.5">
            <h3 className="flex items-center gap-2 font-extrabold text-petrol-950">
              <CheckIcon className="h-4 w-4 text-emerald-500" strokeWidth={2.8} /> حاضرین
            </h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">{toFa(session.presentCount)} نفر</span>
          </header>
          {session.attendees.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-petrol-950/45">هنوز کسی حضور خود را ثبت نکرده است.</p>
          ) : (
            <ul className="divide-y divide-petrol-900/5">
              {session.attendees.map((a, i) => (
                <li key={a.studentId + a.time} className="animate-fade-up flex items-center gap-3 px-5 py-3 transition-colors hover:bg-petrol-50/60" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-petrol-100 text-[11px] font-bold text-petrol-700">{toFa(i + 1)}</span>
                  <span className="flex-1 truncate text-sm font-bold text-petrol-950">{a.name}</span>
                  <span className="flex items-center gap-1 text-xs text-petrol-950/50"><ClockIcon className="h-3.5 w-3.5" />{formatTime(a.time)}</span>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /></span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="animate-fade-up overflow-hidden rounded-xl border border-petrol-900/10 bg-white shadow-sm" style={{ animationDelay: '100ms' }}>
          <header className="flex items-center justify-between border-b border-petrol-900/10 bg-rose-50/60 px-5 py-3.5">
            <h3 className="flex items-center gap-2 font-extrabold text-petrol-950">
              <XIcon className="h-4 w-4 text-rose-500" strokeWidth={2.8} /> غایبین
            </h3>
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-600">{toFa(absentees.length)} نفر</span>
          </header>
          {absentees.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-petrol-950/45">همهٔ دانشجویان حاضرند!</p>
          ) : (
            <ul className="divide-y divide-petrol-900/5">
              {absentees.map((st, i) => (
                <li key={st.id} className="animate-fade-up flex items-center gap-3 px-5 py-3 transition-colors hover:bg-rose-50/50" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-600">{toFa(i + 1)}</span>
                  <span className="flex-1 truncate text-sm font-bold text-petrol-950">{st.name}</span>
                  <span dir="ltr" className="font-mono text-[11px] text-petrol-950/40">@{st.username}</span>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-100 text-rose-500"><XIcon className="h-3.5 w-3.5" strokeWidth={3} /></span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
