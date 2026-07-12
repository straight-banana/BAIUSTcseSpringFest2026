import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  ArrowRight,
  ShieldCheck,
  Siren,
  Users,
  Sparkles,
  Vote,
  Wallet,
  BookOpen,
  ScanSearch,
  Star,
  Trophy,
  Network,
  Armchair,
  Github,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

const MISSIONS = [
  { n: 1, icon: ShieldCheck, title: 'Anonymous Complaints', desc: 'Zero-knowledge reporting with evidence, moderation, and strike tracking.' },
  { n: 2, icon: Armchair, title: 'Smart Seating', desc: 'Constraint-solved classroom layouts with line-of-sight analytics.' },
  { n: 3, icon: BookOpen, title: 'AI Study Planner', desc: 'Syllabus → topic breakdown → personalized calendar.' },
  { n: 4, icon: Wallet, title: 'Tiffin Ledger', desc: 'Shared expenses, budgets, and financial analytics for the class.' },
  { n: 5, icon: Siren, title: 'SOS Network', desc: 'Realtime distress signals with campus map and captain triage.' },
  { n: 6, icon: ScanSearch, title: 'Fact Checker', desc: 'Rule-grounded verdicts against a curated misinformation index.' },
  { n: 7, icon: Star, title: 'Peer Ratings', desc: 'Anonymous multi-category feedback with moderation queue.' },
  { n: 8, icon: Trophy, title: 'Captain Recommendations', desc: 'Weighted candidate scoring reviewed by teachers.' },
  { n: 9, icon: Vote, title: 'Elections', desc: 'End-to-end voting with ballots, results, and audit history.' },
  { n: 10, icon: Network, title: 'Trust Graph', desc: 'Cross-mission signals surface anomalous behavior early.' },
];

function Stat({ k, v }) {
  return (
    <div className="flex flex-col">
      <span className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">{v}</span>
      <span className="text-xs uppercase tracking-widest text-muted mt-1">{k}</span>
    </div>
  );
}

export default function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-dvh bg-bg text-fg">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-bg/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand text-brand-fg grid place-items-center">
              <ShieldCheck size={16} />
            </div>
            <span className="font-semibold tracking-tight">Anti Kuddus Protocol</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
            <a href="#missions" className="hover:text-fg transition">Missions</a>
            <a href="#how" className="hover:text-fg transition">How it works</a>
            <a href="#trust" className="hover:text-fg transition">Trust & safety</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-9 w-9 grid place-items-center rounded-md text-fg hover:bg-elevated border border-transparent hover:border-border transition"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link
              to="/auth/login"
              className="hidden sm:inline-flex items-center h-9 px-3 rounded-md text-sm text-fg hover:bg-elevated border border-transparent hover:border-border transition"
            >
              Sign in
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md text-sm bg-brand text-brand-fg font-medium hover:opacity-90 transition"
            >
              Enter portal <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgb(var(--brand) / 0.35), transparent 45%), radial-gradient(circle at 85% 60%, rgb(var(--accent) / 0.25), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-20">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-2.5 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> University Governance Console · v1.0
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
              The operating system for
              <span style={{ color: '#2f7a55' }}> honest classrooms.</span>
            </h1>
            <p className="mt-5 text-lg text-muted max-w-2xl">
              Ten missions — from anonymous complaints and SOS to elections and a
              class-wide trust graph — built to keep students safe, seen, and
              accountable.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand text-brand-fg font-medium shadow-sm hover:opacity-90 transition"
              >
                Sign in with roll number <ArrowRight size={16} />
              </Link>
              <a
                href="#missions"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border text-fg hover:bg-elevated transition"
              >
                Explore the 10 missions
              </a>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              <Stat k="Missions" v="10" />
              <Stat k="Roles" v="4" />
              <Stat k="Anonymous" v="100%" />
              <Stat k="Realtime" v="SOS" />
            </div>
          </div>
        </div>
      </section>

      {/* Missions grid */}
      <section id="missions" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">The Protocol</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Ten missions, one console.</h2>
          </div>
          <Link to="/auth/login" className="hidden sm:inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
            Open dashboard <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MISSIONS.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.n}
                className="group relative rounded-2xl border border-border bg-elevated p-5 hover:border-brand/60 transition animate-fade-in-up"
                style={{ animationDelay: `${(i % 6) * 40}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-brand/20 text-brand-fg grid place-items-center">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-mono text-subtle">M{String(m.n).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-4 font-semibold text-fg">{m.title}</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">How it works</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">One roll number. Four roles. Zero leakage.</h2>
            <p className="mt-4 text-muted">
              Every action is scoped to a role — student, class captain, teacher, or
              office. Sensitive submissions are anonymized before they leave the
              device, and audit trails stay tamper-evident.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Users, t: 'Role-aware navigation', d: 'The sidebar reshapes itself so nobody sees what they shouldn\'t.' },
                { icon: Sparkles, t: 'Anonymous by default', d: 'Complaints, ratings, and SOS are stripped of identifiers server-side.' },
                { icon: ShieldCheck, t: 'Realtime distress network', d: 'SOS reports fan out to captains and staff within seconds.' },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-brand/20 grid place-items-center">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-fg">{t}</p>
                    <p className="text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-border bg-bg p-6 shadow-xl">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <div className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-2 text-xs font-mono text-muted">kuddus.console/mission-5</span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { s: 'Live', c: 'bg-success', t: 'SOS · Lab-B corridor', m: 'Captain Ayesha responding · 00:12' },
                  { s: 'New', c: 'bg-warning', t: 'Complaint #4821 · Ragging', m: 'Anonymous · awaiting moderation' },
                  { s: 'OK', c: 'bg-brand', t: 'Election · CR round 2', m: '68% turnout · closes 18:00' },
                ].map((r) => (
                  <div key={r.t} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <span className={`h-2 w-2 rounded-full ${r.c}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.t}</p>
                      <p className="text-xs text-muted truncate">{r.m}</p>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-subtle">{r.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="rounded-3xl border border-border bg-elevated p-8 sm:p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 80% 20%, rgb(var(--brand) / 0.3), transparent 50%)',
            }}
          />
          <div className="relative max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-muted">Trust & safety</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Built for the students who need it most.</h2>
            <p className="mt-4 text-muted">
              Ragging, harassment, and unfair grading thrive in silence. The
              Anti Kuddus Protocol makes reporting frictionless, keeps evidence
              intact, and gives class captains a real toolkit — not a suggestion box.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand text-brand-fg font-medium hover:opacity-90 transition"
              >
                Sign in to your campus <ArrowRight size={16} />
              </Link>
              <Link
                to="/auth/welcome"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border hover:bg-surface transition"
              >
                Read the manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-brand text-brand-fg grid place-items-center">
              <ShieldCheck size={12} />
            </div>
            <span>© {new Date().getFullYear()} Anti Kuddus Protocol</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#missions" className="hover:text-fg">Missions</a>
            <a href="#how" className="hover:text-fg">How it works</a>
            <a href="#trust" className="hover:text-fg">Trust</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
              <Github size={14} /> Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
