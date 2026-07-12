import { Sun, Moon, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function AuthHeader() {
  const { theme, toggle } = useTheme();
  return (
    <header className="w-full h-14 px-4 sm:px-6 flex items-center justify-between">
      <Link to="/auth/welcome" className="flex items-center gap-2 group">
        <span className="h-9 w-9 rounded-xl bg-brand text-brand-fg grid place-items-center shadow-sm group-hover:scale-105 transition">
          <ShieldCheck size={18} />
        </span>
        <span className="font-semibold text-fg tracking-tight">Anti Kuddus Protocol</span>
      </Link>
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="h-9 w-9 rounded-md text-muted hover:text-fg hover:bg-elevated flex items-center justify-center transition"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  );
}
