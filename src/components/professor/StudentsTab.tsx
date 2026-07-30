import { useEffect, useState, type FormEvent } from 'react';
import type { AttendanceActions, Session, Student } from '../../types';
import { formatJalali, generateCode, toFa } from '../../lib/utils';
import { EyeIcon, EyeOffIcon, KeyIcon, PlusIcon, PrimaryButton, RefreshIcon, TextInput, TrashIcon, UserIcon } from '../ui';
import type { ToastType } from '../useToast';

interface Props {
  students: Student[];
  sessions: Session[];
  actions: AttendanceActions;
  push: (text: string, type?: ToastType) => void;
}

export default function StudentsTab({ students, sessions, actions, push }: Props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmId) return;
    const t = setTimeout(() => setConfirmId(null), 3000);
    return () => clearTimeout(t);
  }, [confirmId]);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!name.trim() || !username.trim() || !password.trim()) { push('همهٔ فیلدها را تکمیل کنید.', 'error'); return; }
    if (password.length < 6) { push('رمز عبور باید حداقل ۶ کاراکتر باشد.', 'error'); return; }
    if (students.some(s => s.username.toLowerCase() === username.trim().toLowerCase())) { push('این نام کاربری قبلاً ثبت شده است.', 'error'); return; }
    setBusy(true);
    try {
      await actions.addStudent(name, username, password);
      push('دانشجو اضافه شد؛ رمز را به او بدهید (دیگر قابل مشاهده نیست).');
      setName(''); setUsername(''); setPassword('');
    } catch {
      push('خطا در ذخیره‌سازی؛ دوباره تلاش کنید.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await actions.deleteStudent(id);
      push('دانشجو حذف شد.', 'info');
    } catch {
      push('خطا در حذف.', 'error');
    }
    setConfirmId(null);
  };

  const attendedCount = (id: string) =>
    sessions.reduce((n, s) => n + (s.attendees.some(a => a.studentId === id) ? 1 : 0), 0);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
      <form onSubmit={add} className="animate-fade-up rounded-xl border border-petrol-900/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <h3 className="font-display text-2xl text-petrol-950">افزودن دانشجوی جدید</h3>
        <p className="mt-1 text-xs text-petrol-950/55">اطلاعات ورود دانشجو را تعریف کنید</p>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-petrol-950/70">نام و نام خانوادگی</span>
          <TextInput icon={<UserIcon className="h-4 w-4" />} value={name} onChange={e => setName(e.target.value)} placeholder="مثلاً: علی رضایی" />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-petrol-950/70">نام کاربری</span>
          <TextInput icon={<KeyIcon className="h-4 w-4" />} dir="ltr" className="text-left font-mono" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-petrol-950/70">رمز عبور (حداقل ۶ کاراکتر)</span>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <TextInput dir="ltr" type={showPass ? 'text' : 'password'} className="text-left font-mono pe-10" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
              <button type="button" onClick={() => setShowPass(p => !p)} tabIndex={-1}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-petrol-950/40 transition-colors hover:text-petrol-950">
                {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
            <button type="button" onClick={() => setPassword(generateCode(7))} title="تولید رمز تصادفی"
              className="grid w-12 shrink-0 place-items-center rounded-xl border border-petrol-900/15 bg-petrol-50 text-petrol-700 transition-all duration-300 hover:rotate-180 hover:border-saffron-400 hover:bg-saffron-100 hover:text-saffron-700">
              <RefreshIcon className="h-4 w-4" />
            </button>
          </div>
        </label>

        <p className="mt-3 rounded-lg bg-saffron-50 px-3 py-2 text-[11px] font-medium leading-5 text-saffron-800">
          رمز عبور به‌صورت هش‌شده و امن ذخیره می‌شود و بعد از ساخت دیگر قابل مشاهده نیست؛ همین حالا آن را به دانشجو بدهید.
        </p>

        <PrimaryButton type="submit" disabled={busy} className="mt-4 w-full">
          {busy ? 'در حال ذخیره…' : <><PlusIcon className="h-4 w-4" /> افزودن دانشجو</>}
        </PrimaryButton>
      </form>

      <section className="animate-fade-up overflow-hidden rounded-xl border border-petrol-900/10 bg-white shadow-sm" style={{ animationDelay: '80ms' }}>
        <header className="flex items-center justify-between border-b border-petrol-900/10 bg-petrol-50/60 px-5 py-3.5">
          <h3 className="font-extrabold text-petrol-950">لیست دانشجویان</h3>
          <span className="rounded-full bg-petrol-100 px-2.5 py-1 text-[11px] font-bold text-petrol-700">{toFa(students.length)} نفر</span>
        </header>

        {students.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-petrol-950/45">هنوز دانشجویی ثبت نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-petrol-900/10 text-right text-[11px] font-bold text-petrol-950/50">
                  <th className="px-5 py-3">#</th>
                  <th className="px-3 py-3">نام و نام خانوادگی</th>
                  <th className="px-3 py-3">نام کاربری</th>
                  <th className="px-3 py-3">عضویت</th>
                  <th className="px-3 py-3">حضورها</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-petrol-900/5">
                {students.map((st, i) => (
                  <tr key={st.id} className="animate-fade-up transition-colors hover:bg-petrol-50/60" style={{ animationDelay: `${i * 40}ms` }}>
                    <td className="px-5 py-3.5 text-petrol-950/50">{toFa(i + 1)}</td>
                    <td className="px-3 py-3.5 font-bold text-petrol-950">{st.name}</td>
                    <td className="px-3 py-3.5"><span dir="ltr" className="rounded-md bg-petrol-50 px-2 py-1 font-mono text-xs text-petrol-700">{st.username}</span></td>
                    <td className="px-3 py-3.5 text-xs text-petrol-950/55">
                      {formatJalali(st.createdAt.slice(0, 10), { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${attendedCount(st.id) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-petrol-950/5 text-petrol-950/40'}`}>
                        {toFa(attendedCount(st.id))} جلسه
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <button onClick={() => (confirmId === st.id ? remove(st.id) : setConfirmId(st.id))}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all duration-300 ${confirmId === st.id ? 'bg-rose-600 text-white shadow-md shadow-rose-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
                        <TrashIcon className="h-3.5 w-3.5" />
                        {confirmId === st.id ? 'تأیید حذف؟' : 'حذف'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
