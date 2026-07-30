import type { CurrentUser } from '../types';

const KEY = 'att_current_user';

export const loadUser = (): CurrentUser | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  } catch {
    return null;
  }
};

export const saveUser = (u: CurrentUser | null) =>
  u ? localStorage.setItem(KEY, JSON.stringify(u)) : localStorage.removeItem(KEY);
