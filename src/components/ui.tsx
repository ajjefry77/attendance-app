import { useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import type { ToastMsg } from './useToast';

interface IconProps { className?: string; strokeWidth?: number; }

export const CheckIcon = ({ className = 'h-5 w-5', strokeWidth = 2.2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>
);
export const XIcon = ({ className = 'h-5 w-5', strokeWidth = 2.2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const UsersIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
export const UserIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
export const CalendarIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
export const ClockIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
export const CopyIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
export const TrashIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);
export const PlusIcon = ({ className = 'h-5 w-5', strokeWidth = 2 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const RefreshIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></svg>
);
export const LogOutIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
);
export const EyeIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const EyeOffIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><path d="m1 1 22 22" /></svg>
);
export const LockIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
export const KeyIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
);
export const ClipboardIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>
);
export const BookIcon = ({ className = 'h-5 w-5', strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></svg>
);

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> { icon?: ReactNode; }

export function TextInput({ icon, className = '', ...props }: TextInputProps) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-petrol-950/40">{icon}</span>}
      <input
        {...props}
        className={`w-full rounded-xl border border-petrol-900/15 bg-white py-3 text-sm font-medium text-petrol-950 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-petrol-950/35 focus:border-saffron-400 focus:ring-4 focus:ring-saffron-400/20 ${icon ? 'ps-11' : 'ps-4'} pe-4 ${className}`}
      />
    </div>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function PrimaryButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-petrol-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-petrol-800 hover:shadow-lg active:translate-y-0 active:shadow-sm disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${checked ? 'bg-emerald-500' : 'bg-petrol-200'}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${checked ? 'start-6' : 'start-1'}`} />
    </button>
  );
}

export function CopyBtn({ text, onCopied }: { text: string; onCopied?: () => void }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch { }
    setDone(true);
    onCopied?.();
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      title="کپی"
      className={`grid h-7 w-7 place-items-center rounded-md transition-all duration-300 ${done ? 'bg-emerald-100 text-emerald-600' : 'text-petrol-950/45 hover:bg-white hover:text-petrol-950'}`}
    >
      {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : <CopyIcon className="h-3.5 w-3.5" />}
    </button>
  );
}

export function StatCard({ icon, label, value, tone, delay = 0 }: {
  icon: ReactNode; label: string; value: string;
  tone: 'petrol' | 'saffron' | 'green' | 'rose'; delay?: number;
}) {
  const tones: Record<string, string> = {
    petrol: 'bg-petrol-100 text-petrol-700',
    saffron: 'bg-saffron-100 text-saffron-700',
    green: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-600',
  };
  return (
    <div
      className="animate-fade-up rounded-xl border border-petrol-900/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>{icon}</span>
        <div>
          <div className="text-2xl font-extrabold leading-none text-petrol-950">{value}</div>
          <div className="mt-1.5 text-xs font-medium text-petrol-950/55">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, sub }: { icon: ReactNode; title: string; sub?: string }) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-petrol-900/20 bg-white/60 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-petrol-100 text-petrol-500">{icon}</span>
      <p className="font-bold text-petrol-950">{title}</p>
      {sub && <p className="max-w-xs text-sm leading-6 text-petrol-950/55">{sub}</p>}
    </div>
  );
}

export function ToastHost({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 start-5 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-slide-in flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold shadow-xl ${t.type === 'error' ? 'bg-rose-600 text-white' : 'bg-petrol-950 text-white'}`}
        >
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${t.type === 'error' ? 'bg-white/20' : 'bg-emerald-400/25 text-emerald-300'}`}>
            {t.type === 'error' ? <XIcon className="h-3 w-3" strokeWidth={3} /> : <CheckIcon className="h-3 w-3" strokeWidth={3} />}
          </span>
          {t.text}
        </div>
      ))}
    </div>
  );
}
