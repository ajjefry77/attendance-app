export const generateCode = (len = 5): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export const todayISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatJalali = (iso: string, opts?: Intl.DateTimeFormatOptions): string =>
  new Date(iso + 'T12:00:00').toLocaleDateString('fa-IR', opts ?? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const formatTime = (isoDateTime: string): string =>
  new Date(isoDateTime).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

export const toFa = (value: number | string): string =>
  String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
