import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cx } from '../../utils/index.js';

// CSS-only slide-in/out — avoids pulling framer-motion into the critical path.
// Exit animation is driven by a two-phase state: `leaving` triggers the exit
// class, then the item is removed after EXIT_MS.
const EXIT_MS = 180;

const ToastCtx = createContext(null);

const icons = {
  success: <CheckCircle2 size={16} className="text-success" />,
  error: <XCircle size={16} className="text-danger" />,
  warning: <AlertCircle size={16} className="text-warning" />,
  info: <Info size={16} className="text-brand" />,
};

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map()); // id -> { auto, exit }

  const remove = useCallback((id) => {
    setItems((xs) => xs.filter((t) => t.id !== id));
    timers.current.delete(id);
  }, []);

  const dismiss = useCallback((id) => {
    const entry = timers.current.get(id);
    if (entry?.auto) clearTimeout(entry.auto);
    if (entry?.exit) return; // already leaving
    setItems((xs) => xs.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    const exit = setTimeout(() => remove(id), EXIT_MS);
    timers.current.set(id, { ...(entry || {}), auto: null, exit });
  }, [remove]);

  const push = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, tone: 'info', leaving: false, ...toast }]);
    const auto = setTimeout(() => dismiss(id), toast.duration ?? 3200);
    timers.current.set(id, { auto, exit: null });
  }, [dismiss]);

  // Clear all outstanding timers when the provider unmounts.
  useEffect(() => () => {
    for (const { auto, exit } of timers.current.values()) {
      if (auto) clearTimeout(auto);
      if (exit) clearTimeout(exit);
    }
    timers.current.clear();
  }, []);

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-80 pointer-events-none">
        {items.map((t) => (
          <div
            key={t.id}
            className={cx(
              'pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-elevated shadow-md px-3.5 py-3',
              'transition-all duration-200 ease-out will-change-transform',
              t.leaving ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0 animate-toast-in'
            )}
          >
            <span className="mt-0.5">{icons[t.tone] || icons.info}</span>
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-medium text-fg">{t.title}</p>}
              {t.message && <p className="text-xs text-muted mt-0.5">{t.message}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-muted hover:text-fg"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
