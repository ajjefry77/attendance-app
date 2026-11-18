# سامانه حضور و غیاب کلاس

React + Vite برای رابط کاربری، Vercel Functions برای API، و PostgreSQL (Neon) برای ذخیره‌سازی.
هیچ وابستگی‌ای به Firebase وجود ندارد.

## معماری

| لایه | فناوری | مسیر |
| --- | --- | --- |
| رابط کاربری | React + Vite + Tailwind | `src/` |
| API | Vercel Functions (Node) | `api/` |
| دیتابیس | PostgreSQL روی Neon | جداول در `api/_lib/sql.ts` |
| احراز هویت | توکن امضاشده با HMAC + scrypt برای رمزها | `api/_lib/auth.ts`، `api/_lib/password.ts` |

جداول: `students`، `professors`، `sessions`، `attendance`. ساخت جداول در اولین درخواست
به‌صورت خودکار و idempotent انجام می‌شود (`ensureSchema` در `api/_lib/db.ts`).

## متغیرهای محیطی

فایل `.env.example` را به `.env` کپی کنید و مقادیر را پر کنید:

```bash
cp .env.example .env
```

| متغیر | توضیح |
| --- | --- |
| `DATABASE_URL` | رشتهٔ اتصال Neon (Vercel هنگام ساخت Integration آن را می‌سازد) |
| `AUTH_SECRET` | کلید تصادفی برای امضای توکن نشست |
| `PROFESSOR_USERNAME` / `PROFESSOR_PASSWORD` / `PROFESSOR_NAME` | حساب استاد؛ با هر استقرار از متغیرها همگام می‌شود |

## اجرای محلی

```bash
npm install
npm run dev
```

پلاگین `vite-api-plugin.ts` توابع پوشهٔ `api/` را داخل همان سرور Vite اجرا می‌کند؛
پس برای توسعهٔ محلی نیازی به Vercel CLI نیست. متغیرهای `.env` هم به‌صورت خودکار خوانده می‌شوند.

ساخت نسخهٔ production:

```bash
npm run build
npm run lint
```

## استقرار روی Vercel با Neon

1. پروژه را در GitHub بگذارید و در Vercel با گزینهٔ **Add New → Project** ایمپورت کنید
   (Framework Preset: Vite، Build Command: `npm run build`، Output: `dist`).
2. در داشبورد پروژه: **Storage → Marketplace → Neon** را نصب کنید و یک دیتابیس بسازید.
   Vercel متغیر `DATABASE_URL` را به‌صورت خودکار به پروژه اضافه می‌کند.
3. در **Settings → Environment Variables** مقادیر `AUTH_SECRET`، `PROFESSOR_USERNAME`،
   `PROFESSOR_PASSWORD` و `PROFESSOR_NAME` را برای Production و Preview تنظیم کنید.
4. Redeploy کنید. اولین درخواست، جداول را می‌سازد و حساب استاد را ثبت می‌کند.

## نکات امنیتی

- رمزها با scrypt و نمک یکتا در سرور هش می‌شوند؛ هش و نمک هرگز به مرورگر فرستاده نمی‌شود.
- کد جلسه فقط برای استاد برگردانده می‌شود؛ بررسی صحت کد در `api/attendance.ts` سمت سرور است.
- نام کاربری دانشجویان فقط برای استاد قابل مشاهده است.
- برای تغییر رمز استاد، مقدار `PROFESSOR_PASSWORD` را در Vercel تغییر دهید و Redeploy کنید.
