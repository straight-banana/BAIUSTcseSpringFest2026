import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const TONE = {
  brand: 'from-brand/15 to-brand/5 text-brand ring-brand/30',
  accent: 'from-accent/20 to-accent/5 text-accent-fg ring-accent/40',
  danger: 'from-danger/15 to-danger/5 text-danger ring-danger/30',
};

export default function RoleCard({ icon: Icon, title, description, tone = 'brand', selected, onSelect, onContinue }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`text-left w-full rounded-2xl border bg-surface p-5 transition group focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 ${
        selected ? 'border-brand ring-4 ring-brand/20 shadow-lg' : 'border-border hover:border-fg/30 hover:shadow-md'
      }`}
    >
      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ring-1 grid place-items-center mb-4 ${TONE[tone]}`}>
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      <p className="mt-1 text-sm text-muted min-h-[2.5rem]">{description}</p>
      <span
        onClick={(e) => { e.stopPropagation(); onContinue?.(); }}
        className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition ${
          selected ? 'text-brand' : 'text-muted group-hover:text-fg'
        }`}
      >
        Continue <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
      </span>
    </motion.button>
  );
}
