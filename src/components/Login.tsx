import { useEffect, useState, type FormEvent } from 'react';
import type { LoginResult } from '../types';
import { ApiError, login } from '../lib/api';
import { formatJalali, todayISO } from '../lib/utils';
import { CheckIcon, ClipboardIcon, ClockIcon, EyeIcon, EyeOffIcon, LockIcon, PrimaryButton, TextInput, UserIcon, XIcon } from './ui';

const SAMPLE = [
  { name: 'علی رضایی', time: '۰۸:۰۲' },
  { name: 'مریم احمدی', time: '۰۸:۰۵' },
  { name: 'حسین کریمی', time: '۰۸:۱۱' },
  { name: 'زهرا محمدی', time: '۰۸:۱۶' },
];

export default function Login({ onLogin }: { onLogin: (result: LoginResult) => void }) {
  const [role, setRole] = useState<'student' | 'professor'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      onLogin(await login(role, username, password));
      return;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(role === 'professor' ? 'نام کاربری یا رمز عبور استاد نادرست است.' : 'نام کاربری یا رمز عبور دانشجو نادرست است.');
      } else if (err instanceof ApiError && err.status === 500) {
        setError('خطا در سرور؛ اتصال دیتابیس را بررسی کنید.');
      } else {
        setError('خطا در اتصال به سرور؛ اینترنت را بررسی کنید.');
      }
    } finally {
      setBusy(false);
    }
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-paper relative flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="animate-fade-up flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-saffron-400 text-petrol-950 shadow-lg shadow-saffron-400/40">
              <ClipboardIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-lg leading-none text-petrol-950">سامانه حضور و غیاب</p>
              <p className="mt-1.5 text-xs text-petrol-950/55">مدیریت جلسات کلاس درس</p>
            </div>
          </div>

          <h1 className="animate-fade-up mt-10 font-display text-5xl leading-tight text-petrol-950" style={{ animationDelay: '80ms' }}>
            ورود به کلاس
          </h1>
          <p className="animate-fade-up mt-2 text-sm text-petrol-950/60" style={{ animationDelay: '140ms' }}>
            نقش خود را انتخاب کنید و وارد شوید
          </p>

          <div className="animate-fade-up relative mt-8 grid grid-cols-2 rounded-xl border border-petrol-900/10 bg-white p-1.5 shadow-sm" style={{ animationDelay: '200ms' }}>
            <span className={`absolute inset-y-1.5 w-[calc(50%-6px)] rounded-lg bg-petrol-900 shadow-md transition-all duration-300 ease-out ${role === 'student' ? 'start-1.5' : 'start-1/2'}`} />
            <button type="button" onClick={() => { setRole('student'); setError(''); }}
              className={`relative z-10 rounded-lg py-2.5 text-sm font-bold transition-colors duration-300 ${role === 'student' ? 'text-white' : 'text-petrol-950/55 hover:text-petrol-950'}`}>
              دانشجو
            </button>
            <button type="button" onClick={() => { setRole('professor'); setError(''); }}
              className={`relative z-10 rounded-lg py-2.5 text-sm font-bold transition-colors duration-300 ${role === 'professor' ? 'text-white' : 'text-petrol-950/55 hover:text-petrol-950'}`}>
              استاد
            </button>
          </div>

          <form onSubmit={submit} className={`animate-fade-up mt-6 ${shaking ? 'animate-shake' : ''}`} style={{ animationDelay: '260ms' }}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-petrol-950/70">نام کاربری</span>
              <TextInput icon={<UserIcon className="h-4 w-4" />} dir="ltr" className="text-left font-mono"
                value={username} onChange={e => setUsername(e.target.value)}
                placeholder={role === 'professor' ? 'professor username' : 'student username'} />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-bold text-petrol-950/70">رمز عبور</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-petrol-950/40 z-10"><LockIcon className="h-4 w-4" /></span>
                <input type={showPass ? 'text' : 'password'} dir="ltr"
                  value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full rounded-xl border border-petrol-900/15 bg-white py-3 pe-10 ps-11 text-sm font-medium text-petrol-950 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-petrol-950/35 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-400/20 text-left font-mono" />
                <button type="button" onClick={() => setShowPass(p => !p)} tabIndex={-1}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-petrol-950/40 transition-colors hover:text-petrol-950">
                  {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-600">
                <XIcon className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <PrimaryButton type="submit" disabled={busy} className="mt-5 w-full">
              {busy ? 'در حال بررسی…' : (
                <>ورود به پنل <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span></>
              )}
            </PrimaryButton>

            <p className="mt-4 text-center text-[11px] text-petrol-950/45">
              {role === 'student' ? 'نام کاربری و رمز عبور خود را از استاد دریافت کنید.' : 'دسترسی ویژهٔ مدیریت کلاس.'}
            </p>
          </form>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-petrol-950 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 opacity-[.1]" style={{ backgroundImage: 'linear-gradient(to left, rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.4) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
        <span className="pointer-events-none absolute -bottom-12 start-2 select-none font-display text-[15rem] leading-none text-white/[.04]">حضور</span>

        <div className="relative w-full max-w-md px-10">
          <div className="animate-fade-up rounded-2xl border border-white/10 bg-petrol-900/80 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-display text-lg text-white">برگه حضور و غیاب</p>
                <p className="mt-1 text-[11px] text-white/50">{formatJalali(todayISO())}</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-300" />
                زنده
              </span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {SAMPLE.map((r, i) => (
                <li key={r.name} className="animate-fade-up flex items-center justify-between rounded-lg bg-white/5 px-3.5 py-2.5" style={{ animationDelay: `${300 + i * 180}ms` }}>
                  <span className="flex items-center gap-2.5 text-sm text-white/85">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {r.name}
                  </span>
                  <span dir="ltr" className="text-xs text-white/45">{r.time}</span>
                </li>
              ))}
              <li className="animate-fade-up flex items-center gap-2.5 rounded-lg border border-dashed border-white/15 px-3.5 py-2.5 text-sm text-white/40" style={{ animationDelay: '1050ms' }}>
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-saffron-300" />
                در حال ثبت…
              </li>
            </ul>
          </div>

          <div className="animate-float absolute -bottom-9 -start-4 grid h-28 w-28 place-items-center rounded-full border-[3px] border-dashed border-saffron-300/70 bg-saffron-400/10 text-center backdrop-blur-sm">
            <div>
              <p className="font-display text-xl text-saffron-300">تأیید</p>
              <p dir="ltr" className="text-[9px] font-bold tracking-[.25em] text-saffron-200/70">VERIFIED</p>
            </div>
          </div>

          <div className="animate-fade-up mt-7 flex items-center justify-center gap-2 text-white/70" style={{ animationDelay: '500ms' }}>
            <ClockIcon className="h-4 w-4 text-saffron-300" />
            <span dir="ltr" className="text-sm font-bold tracking-wider">{now.toLocaleTimeString('fa-IR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
