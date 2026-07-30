import { useEffect, useState, type FormEvent } from 'react';
import type { AttendanceActions, CurrentUser, Session, Student } from '../../types';
import { formatJalali, formatTime, todayISO, toFa } from '../../lib/utils';
import { BookIcon, CalendarIcon, CheckIcon, ClockIcon, EmptyState, LogOutIcon, PrimaryButton, ToastHost, UserIcon } from '../ui';
import { useToast } from '../useToast';

interface Props {
  user: Extract<CurrentUser, { role: 'student' }>;
  students: Student[];
  sessions: Session[];
  actions: AttendanceActions;
  onLogout: () => void;
}

export default function StudentPanel({ user, students, sessions, actions, onLogout }: Props) {
  const student = students.find(s => s.id === user.studentId);
  const { toasts, push } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [shaking, setShaking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [justMarked, setJustMarked] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!student) return null;

  const today = todayISO();
  const activeToday = sessions.filter(s => s.date === today && s.active);
  const selected = sessions.find(s => s.id === selectedId && s.date === today && s.active) ?? null;
  const myRecord = (s: Session) => s.attendees.find(a => a.studentId === student.id);

  const history = sessions
    .flatMap(s => {
      const record = myRecord(s);
      return record ? [{ session: s, record }] : [];
    })
    .sort((a, b) => b.record.time.localeCompare(a.record.time));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected || busy) return;
    if (selected.attendees.some(a => a.studentId === student.id)) return;

    if (code.trim().toUpperCase() === selected.code.toUpperCase()) {
      setBusy(true);
      try {
        await actions.markAttendance(selected.id, student);
        setCode('');
        setJustMarked(selected.id);
        setTimeout(() => setJustMarked(null), 2600);
        push('حضور شما با موفقیت ثبت شد.');
      } catch {
        push('خطا در ثبت حضور؛ دوباره تلاش کنید.', 'error');
      } finally {
        setBusy(false);
      }
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      push('عبارت ورود نادرست است؛ دوباره تلاش کنید.', 'error');
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-16">
      <header className="sticky top-0 z-40 border-b-4 border-saffron-400 bg-petrol-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-saffron-400 text-petrol-950 shadow-md">
              <UserIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-xl leading-none">پنل دانشجو</h1>
              <p className="mt-1.5 text-[11px] text-white/55">{student.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white/80 sm:flex">
              <ClockIcon className="h-4 w-4 text-saffron-300" />
              <span dir="ltr">{now.toLocaleTimeString('fa-IR')}</span>
            </span>
            <button onClick={onLogout}
              className="group flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/85 transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-500/20 hover:text-rose-200">
              <LogOutIcon className="h-4 w-4 -scale-x-100 transition-transform duration-300 group-hover:-translate-x-0.5" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4">
        <section className="animate-fade-up mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-4xl text-petrol-950">سلام، {student.name.split(' ')[0]}!</h2>
            <p className="mt-1.5 text-sm text-petrol-950/55">{formatJalali(today)} — برای ثبت حضور، کد جلسه را وارد کن.</p>
          </div>
          <span className="rounded-full border border-petrol-900/10 bg-white px-3.5 py-1.5 text-xs font-bold text-petrol-700 shadow-sm">
            {toFa(history.length)} حضور ثبت‌شده
          </span>
        </section>

        <section className="animate-fade-up mt-7" style={{ animationDelay: '100ms' }}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-petrol-950/70">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-500" />
            جلسه فعال امروز
          </h3>

          {activeToday.length === 0 ? (
            <EmptyState icon={<CalendarIcon className="h-6 w-6" />} title="هیچ جلسهٔ فعالی برای امروز ثبت نشده" sub="منتظر بمان تا استاد جلسهٔ جدیدی ایجاد کند." />
          ) : (
            <div className="space-y-3">
              {activeToday.map(s => {
                const rec = myRecord(s);
                const isSelected = selectedId === s.id;
                return (
                  <div key={s.id}
                    className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ${rec ? 'border-emerald-300' : isSelected ? 'border-saffron-400 ring-4 ring-saffron-400/15' : 'border-petrol-900/10 hover:border-petrol-300'}`}>
                    <button onClick={() => !rec && setSelectedId(isSelected ? null : s.id)} disabled={!!rec}
                      className="flex w-full items-center gap-3 px-5 py-4 text-start">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${rec ? 'bg-emerald-100 text-emerald-600' : 'bg-petrol-100 text-petrol-700'}`}>
                        {rec ? <CheckIcon strokeWidth={2.6} /> : <BookIcon />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-extrabold text-petrol-950">{s.title}</span>
                        <span className="mt-0.5 block text-xs text-petrol-950/50">{formatJalali(s.date)} · {toFa(s.attendees.length)} نفر حاضر</span>
                      </span>
                      {rec ? (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                          حاضر ✓ ساعت {formatTime(rec.time)}
                        </span>
                      ) : (
                        <span className={`shrink-0 text-xs font-bold transition-colors ${isSelected ? 'text-saffron-600' : 'text-petrol-950/40'}`}>
                          {isSelected ? 'بستن' : 'ثبت حضور'}
                        </span>
                      )}
                    </button>

                    {justMarked === s.id && (
                      <div className="flex flex-col items-center gap-3 border-t border-emerald-200 bg-emerald-50/60 px-5 py-8">
                        <div className="animate-stamp grid h-28 w-28 place-items-center rounded-full border-4 border-emerald-500 bg-white text-emerald-600 shadow-[0_0_0_10px_rgba(16,185,129,0.12)]">
                          <div className="text-center">
                            <CheckIcon className="mx-auto h-9 w-9" strokeWidth={3} />
                            <span className="font-display text-lg leading-none">حاضر</span>
                          </div>
                        </div>
                        <p className="text-sm font-extrabold text-emerald-700">حضور شما ثبت شد!</p>
                      </div>
                    )}

                    {isSelected && !rec && justMarked !== s.id && (
                      <form onSubmit={submit} className="animate-fade-in border-t border-petrol-900/10 bg-petrol-50/50 px-5 py-5">
                        <label className="block text-center">
                          <span className="mb-2 block text-xs font-bold text-petrol-950/60">عبارت ورودی که استاد اعلام کرده را وارد کن</span>
                          <input dir="ltr" autoFocus value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="XXXXX"
                            className={`mx-auto w-full max-w-xs rounded-xl border-2 bg-white py-3.5 text-center font-mono text-lg font-bold uppercase tracking-[.4em] outline-none transition-all duration-300 placeholder:tracking-[.4em] placeholder:text-petrol-950/25 ${shaking ? 'animate-shake border-rose-400' : 'border-petrol-900/15 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-400/20'}`} />
                        </label>
                        <PrimaryButton type="submit" disabled={busy} className="mx-auto mt-4 flex">
                          {busy ? 'در حال ثبت…' : <><CheckIcon className="h-4 w-4" strokeWidth={2.6} /> ثبت حضور</>}
                        </PrimaryButton>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="animate-fade-up mt-10" style={{ animationDelay: '180ms' }}>
          <h3 className="mb-3 text-sm font-extrabold text-petrol-950/70">سابقهٔ حضور من</h3>
          {history.length === 0 ? (
            <p className="rounded-xl border border-dashed border-petrol-900/15 bg-white/60 px-5 py-8 text-center text-sm text-petrol-950/45">
              هنوز حضوری ثبت نکرده‌ای.
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map(({ session: s, record }, i) => (
                <li key={s.id}
                  className="animate-fade-up flex items-center gap-3 rounded-xl border border-petrol-900/10 bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckIcon className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="flex-1 truncate text-sm font-bold text-petrol-950">{s.title}</span>
                  <span className="hidden text-xs text-petrol-950/50 sm:block">{formatJalali(s.date, { day: 'numeric', month: 'long' })}</span>
                  <span className="rounded-lg bg-petrol-50 px-2.5 py-1 text-[11px] font-bold text-petrol-700">{formatTime(record.time)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <ToastHost toasts={toasts} />
    </div>
  );
}
