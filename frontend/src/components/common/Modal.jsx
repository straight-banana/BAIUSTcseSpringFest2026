import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md rounded-xl bg-elevated border border-border shadow-lg overflow-hidden"
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h3 className="text-sm font-semibold text-fg">{title}</h3>
                <button
                  aria-label="Close dialog"
                  onClick={onClose}
                  className="text-muted hover:text-fg rounded-md p-1 hover:bg-surface"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="p-5 text-sm text-fg">{children}</div>
            {footer && <div className="border-t border-border px-5 py-3 bg-surface">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
