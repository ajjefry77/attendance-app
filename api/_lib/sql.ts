// همهٔ SQLهای سمت سرور در یک‌جا نگه‌داری می‌شوند تا هم بازبینی و هم تست آسان باشد.

const isoUtc = (column: string) =>
  `to_char(${column} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;

export const schemaStatements: string[] = [
  `create table if not exists students (
    id text primary key,
    name text not null,
    username text not null unique,
    pass_hash text not null,
    salt text not null,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists professors (
    id text primary key,
    name text not null,
    username text not null unique,
    pass_hash text not null,
    salt text not null,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists sessions (
    id text primary key,
    title text not null,
    code text not null,
    session_date date not null,
    active boolean not null default true,
    created_at timestamptz not null default now()
  )`,
  `create table if not exists attendance (
    session_id text not null references sessions(id) on delete cascade,
    student_id text not null references students(id) on delete cascade,
    student_name text not null,
    marked_at timestamptz not null default now(),
    primary key (session_id, student_id)
  )`,
];

export const upsertProfessor = `insert into professors (id, name, username, pass_hash, salt)
  values ($1, $2, $3, $4, $5)
  on conflict (username) do update set
    name = excluded.name,
    pass_hash = excluded.pass_hash,
    salt = excluded.salt`;

export const findProfessor = `select id, name, username, salt, pass_hash from professors where username = $1`;

export const findStudent = `select id, name, username, salt, pass_hash from students where username = $1`;

export const listStudents = `select s.id, s.name, s.username, ${isoUtc('s.created_at')} as created_at
  from students s order by s.created_at asc`;

export const listSessions = `select s.id, s.title, s.code, to_char(s.session_date, 'YYYY-MM-DD') as session_date,
    s.active, ${isoUtc('s.created_at')} as created_at
  from sessions s order by s.created_at desc`;

export const listAttendance = `select a.session_id, a.student_id, a.student_name, ${isoUtc('a.marked_at')} as marked_at
  from attendance a order by a.marked_at asc`;

export const insertStudent = `insert into students (id, name, username, pass_hash, salt)
  values ($1, $2, $3, $4, $5) returning id`;

export const deleteStudent = `delete from students where id = $1 returning id`;

export const insertSession = `insert into sessions (id, title, code, session_date)
  values ($1, $2, $3, $4) returning id`;

export const setSessionActive = `update sessions set active = $2 where id = $1 returning id`;

export const deleteSession = `delete from sessions where id = $1 returning id`;

export const findSession = `select id, code, active from sessions where id = $1`;

export const insertAttendance = `insert into attendance (session_id, student_id, student_name)
  select s.id, st.id, st.name
  from sessions s join students st on st.id = $2
  where s.id = $1
  on conflict (session_id, student_id) do nothing
  returning student_id`;

export const countAttendance = `select count(*)::int as present from attendance where session_id = $1`;
