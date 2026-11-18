import type { CurrentUser } from '../types';

const USER_KEY = 'att_current_user';
const TOKEN_KEY = 'att_token';

export const loadUser = (): CurrentUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
};

export const saveUser = (u: CurrentUser | null) =>
  u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY);

export const loadToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const saveToken = (token: string | null) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
