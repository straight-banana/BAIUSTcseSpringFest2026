import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function SosButton({ onClick, size = 'lg' }) {
  const dim = size === 'lg' ? 'h-56 w-56 text-2xl' : 'h-32 w-32 text-base';
  return (
    <motion.button
      onClick={onClick}
      aria-label="Trigger SOS emergency"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className={`${dim} rounded-full bg-danger text-white shadow-2xl shadow-danger/40 font-bold uppercase tracking-widest relative flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-danger/40`}
    >
      <span className="absolute inset-0 rounded-full bg-danger/60 animate-ping opacity-40" />
      <AlertTriangle size={size === 'lg' ? 42 : 24} strokeWidth={2.5} className="relative" />
      <span className="relative">SOS</span>
    </motion.button>
  );
}
