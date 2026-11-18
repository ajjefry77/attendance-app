import type { LoginResult, StateSnapshot } from '../types';
import { loadToken } from './storage';

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string) {
    super(code);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(
  path: string,
  init: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = loadToken();
  if (token) headers.authorization = `Bearer ${token}`;
  if (init.body !== undefined) headers['content-type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(`/api/${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new ApiError(0, 'network_error');
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const code =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : 'request_failed';
    throw new ApiError(response.status, code);
  }
  return payload as T;
}

export const login = (role: 'professor' | 'student', username: string, password: string) =>
  request<LoginResult>('login', { method: 'POST', body: { role, username, password } });

export const fetchState = () => request<StateSnapshot>('state');

export const createStudent = (name: string, username: string, password: string) =>
  request<{ ok: true }>('students', { method: 'POST', body: { name, username, password } });

export const removeStudent = (id: string) =>
  request<{ ok: true }>(`students?id=${encodeURIComponent(id)}`, { method: 'DELETE' });

export const createSession = (title: string, code: string) =>
  request<{ ok: true }>('sessions', { method: 'POST', body: { title, code } });

export const setSessionActive = (id: string, active: boolean) =>
  request<{ ok: true }>('sessions', { method: 'PATCH', body: { id, active } });

export const removeSession = (id: string) =>
  request<{ ok: true }>(`sessions?id=${encodeURIComponent(id)}`, { method: 'DELETE' });

export const markAttendance = (sessionId: string, code: string) =>
  request<{ ok: true; presentCount: number }>('attendance', {
    method: 'POST',
    body: { sessionId, code },
  });
