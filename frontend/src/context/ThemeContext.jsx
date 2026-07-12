import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [colorblind, setColorblind] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('colorblind') === '1';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('colorblind', colorblind);
    localStorage.setItem('colorblind', colorblind ? '1' : '0');
  }, [colorblind]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const toggleColorblind = useCallback(() => setColorblind((v) => !v), []);

  const value = useMemo(
    () => ({ theme, setTheme, toggle, colorblind, setColorblind, toggleColorblind }),
    [theme, toggle, colorblind, toggleColorblind]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
