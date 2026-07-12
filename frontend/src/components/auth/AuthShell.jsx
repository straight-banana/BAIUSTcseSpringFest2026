import { motion } from 'framer-motion';
import AuthHeader from './AuthHeader.jsx';
import AuthFooter from './AuthFooter.jsx';

export default function AuthShell({ children, aside, centered = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg">
      <AuthHeader />
      <main className="flex-1 flex">
        {aside && (
          <aside className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-brand/15 via-accent/10 to-danger/10 border-r border-border">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, rgb(var(--brand) / 0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgb(var(--accent) / 0.25), transparent 45%)',
              }}
            />
            <div className="relative flex-1 flex items-center justify-center p-10">
              {aside}
            </div>
          </aside>
        )}
        <section className={`flex-1 flex ${centered ? 'items-center' : 'items-start lg:items-center'} justify-center p-4 sm:p-8`}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </section>
      </main>
      <AuthFooter />
    </div>
  );
}
