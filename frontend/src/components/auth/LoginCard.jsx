import { motion } from 'framer-motion';

export default function LoginCard({ title, description, children, footer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8"
    >
      <h1 className="text-2xl font-semibold tracking-tight text-fg">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      <div className="mt-6 space-y-4">{children}</div>
      {footer && <div className="mt-6 pt-4 border-t border-border text-xs text-muted">{footer}</div>}
    </motion.div>
  );
}
