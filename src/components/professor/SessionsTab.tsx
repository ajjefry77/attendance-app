import { useEffect, useState, type FormEvent } from 'react';
import type { AttendanceActions, Session } from '../../types';
import { formatJalali, generateCode, todayISO, toFa } from '../../lib/utils';
import { CalendarIcon, CheckIcon, CopyBtn, EmptyState, KeyIcon, PlusIcon, PrimaryButton, RefreshIcon, Switch, TextInput, TrashIcon } from '../ui';
import type { ToastType } from '../useToast';

interface Props {
  sessions: Session[];
  actions: AttendanceActions;
  push: (text: string, type?: ToastType) => void;
}

export default function SessionsTab({ sessions, actions, push }: Props) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState(generateCode());
  const [busy, setBusy] = useState(false);
  const today = todayISO();

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!title.trim()) { push('عنوان جلسه را وارد کنید.', 'error'); return; }
    setBusy(true);
    try {
      await actions.createSession(title, code);
      setTitle('');
      setCode(generateCode());
      push('جلسه ایجاد شد؛ دانشجویان می‌توانند حضور خود را ثبت کنند.');
    } catch {
      push('خطا در ایجاد جلسه؛ دوباره تلاش کنید.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = (id: string) => {
    const s = sessions.find(x => x.id === id);
    if (s) actions.toggleSession(id, !s.active);
  };

  const remove = async (id: string) => {
    try {
      await actions.deleteSession(id);
      push('جلسه حذف شد.', 'info');
    } catch {
      push('خطا در حذف جلسه.', 'error');
    }
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
      <form onSubmit={create} className="animate-fade-up rounded-xl border border-petrol-900/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h3 className="font-display text-2xl text-petrol-950">ایجاد جلسه جدید</h3>
        <p className="mt-1 text-xs text-petrol-950/55">جلسه با تاریخ امروز ثبت می‌شود</p>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-petrol-50 px-3.5 py-2.5 text-xs font-bold text-petrol-700">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {formatJalali(today)}
          <span className="ms-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">امروز</span>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-petrol-950/70">عنوان جلسه</span>
          <TextInput value={title} onChange={e => setTitle(e.target.value)} placeholder="مثلاً: جلسه پنجم – پایگاه داده" />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-petrol-950/70">عبارت ورود (کد حضور)</span>
          <div className="flex gap-2">
            <input dir="ltr" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-petrol-900/15 bg-white px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-[.35em] outline-none transition-all duration-300 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-400/20" />
            <button type="button" onClick={() => setCode(generateCode())} title="تولید کد جدید"
              className="grid w-12 shrink-0 place-items-center rounded-xl border border-petrol-900/15 bg-petrol-50 text-petrol-700 transition-all duration-300 hover:rotate-180 hover:border-saffron-400 hover:bg-saffron-100 hover:text-saffron-700">
              <RefreshIcon className="h-4 w-4" />
            </button>
          </div>
        </label>

        <PrimaryButton type="submit" disabled={busy} className="mt-5 w-full">
          {busy ? 'در حال ایجاد…' : <><PlusIcon className="h-4 w-4" /> ایجاد جلسه</>}
        </PrimaryButton>
      </form>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <EmptyState icon={<CalendarIcon className="h-6 w-6" />} title="هنوز جلسه‌ای ایجاد نشده" sub="از فرم کناری اولین جلسهٔ کلاس خود را بسازید." />
        ) : (
          sessions.map((s, i) => (
            <SessionCard key={s.id} session={s} index={i} onToggle={toggleActive} onDelete={remove} push={push} />
          ))
        )}
      </div>
    </div>
  );
}

function SessionCard({ session: s, index, onToggle, onDelete, push }: {
  session: Session; index: number;
  onToggle: (id: string) => void; onDelete: (id: string) => void;
  push: (text: string, type?: ToastType) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  const isToday = s.date === todayISO();

  return (
    <div
      className={`animate-fade-up rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md ${s.active && isToday ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-petrol-900/10'}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate font-extrabold text-petrol-950">{s.title}</h4>
            {isToday && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">امروز</span>}
            {s.active ? (
              <span className="flex items-center gap-1.5 rounded-full bg-petrol-100 px-2 py-0.5 text-[10px] font-bold text-petrol-700">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-500" /> فعال
              </span>
            ) : (
              <span className="rounded-full bg-petrol-950/5 px-2 py-0.5 text-[10px] font-bold text-petrol-950/50">بسته</span>
            )}
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-petrol-950/55">
            <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" />{formatJalali(s.date)}</span>
            <span className="flex items-center gap-1"><CheckIcon className="h-3.5 w-3.5 text-emerald-500" />{toFa(s.presentCount)} حاضر</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-petrol-900/10 bg-petrol-50 px-3 py-2">
          <KeyIcon className="h-3.5 w-3.5 text-saffron-600" />
          <span dir="ltr" className="font-mono text-sm font-bold tracking-[.3em] text-petrol-950">{s.code}</span>
          <CopyBtn text={s.code} onCopied={() => push('کد جلسه کپی شد.')} />
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={s.active} onChange={() => onToggle(s.id)} />
          <button onClick={() => (confirming ? onDelete(s.id) : setConfirming(true))}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-300 ${confirming ? 'bg-rose-600 text-white shadow-md shadow-rose-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
            <TrashIcon className="h-4 w-4" />
            {confirming ? 'تأیید حذف؟' : 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
}
