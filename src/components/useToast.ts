import { useCallback, useRef, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMsg { id: number; text: string; type: ToastType; }

export function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const counter = useRef(0);

  const push = useCallback((text: string, type: ToastType = 'success') => {
    const id = ++counter.current;
    setToasts(prev => [...prev.slice(-2), { id, text, type }]);
    window.setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  return { toasts, push };
}
