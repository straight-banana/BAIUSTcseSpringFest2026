import { Globe } from 'lucide-react';

export default function AuthFooter() {
  return (
    <footer className="w-full px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
      <span>© {new Date().getFullYear()} Anti Kuddus Protocol · v0.2.0-alpha</span>
      <button className="flex items-center gap-1.5 hover:text-fg transition">
        <Globe size={13} /> English
      </button>
    </footer>
  );
}
