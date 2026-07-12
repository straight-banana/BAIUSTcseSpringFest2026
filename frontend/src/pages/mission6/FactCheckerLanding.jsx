import { useNavigate, Link } from 'react-router-dom';
import { SearchCheck, TrendingUp, BookOpen, History, Sparkles } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import SearchBar from '../../components/mission6/SearchBar.jsx';
import TrendingCard from '../../components/mission6/TrendingCard.jsx';
import HistoryCard from '../../components/mission6/HistoryCard.jsx';
import { RULE_CATEGORIES, SAMPLE_CLAIMS, TRENDING, HISTORY } from '../../mocks/data/mission6.js';

export default function FactCheckerLanding() {
  const nav = useNavigate();
  const go = (q) => nav(`/mission-6/result?q=${encodeURIComponent(q)}`);

  return (
    <PageContainer>
      <PageHeader
        title="Kuddus Fact Checker"
        subtitle="Verify campus rumors, notices, and academic claims against the official rulebook."
        icon={<SearchCheck size={18} />}
      />
      <Mission6SubNav />

      {/* HERO */}
      <Card className="relative overflow-hidden p-6 sm:p-10 bg-gradient-to-br from-brand-soft/70 via-accent/10 to-surface">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/10 blur-3xl" aria-hidden />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1 text-[11px] text-muted">
            <Sparkles size={12} className="text-brand" /> AI-powered semantic search
          </div>
          <h2 className="mt-4 text-2xl sm:text-4xl font-bold text-fg tracking-tight">
            Don't guess. <span className="text-brand">Fact-check it.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            Ask any question about rules, exams, hostel policy, or a Kuddus claim.
          </p>
          <div className="mt-6">
            <SearchBar onSubmit={go} autoFocus />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/mission-6/rules" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-fg hover:bg-elevated">
              <BookOpen size={12} /> Browse Rules
            </Link>
            <Link to="/mission-6/history" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-fg hover:bg-elevated">
              <History size={12} /> Recent Checks
            </Link>
            <Link to="/mission-6/trending" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-fg hover:bg-elevated">
              <TrendingUp size={12} /> Trending
            </Link>
          </div>
        </div>
      </Card>

      {/* CATEGORY CHIPS */}
      <div className="mt-6">
        <SectionHeader title="Quick categories" description="Jump to a rulebook section" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {RULE_CATEGORIES.slice(0, 12).map((c) => (
            <Link
              key={c.key}
              to={`/mission-6/rules?cat=${c.key}`}
              className="rounded-xl border border-border bg-surface p-3 hover:shadow-md hover:-translate-y-0.5 transition text-center"
            >
              <div className="text-2xl">{c.icon}</div>
              <div className="mt-1 text-xs font-medium text-fg">{c.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* EXAMPLE CLAIMS */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Example claims" description="Tap to fact-check instantly" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_CLAIMS.slice(0, 8).map((c) => (
              <button
                key={c.q}
                onClick={() => go(c.q)}
                className="text-left rounded-lg border border-border bg-surface p-3 text-sm text-fg hover:bg-elevated hover:border-brand/50 transition"
              >
                "{c.q}"
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader
            title="Recent searches"
            description="Your last checks"
            action={<Link to="/mission-6/history" className="text-xs text-brand hover:underline">View all</Link>}
          />
          <div className="space-y-2">
            {HISTORY.slice(0, 3).map((h) => (
              <HistoryCard key={h.id} item={h} onSearch={(i) => go(i.query)} />
            ))}
          </div>
        </Card>
      </div>

      {/* TRENDING */}
      <div className="mt-6">
        <SectionHeader
          title="Trending misinformation"
          description="Most searched claims this week"
          action={<Link to="/mission-6/trending" className="text-xs text-brand hover:underline">See all</Link>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRENDING.slice(0, 6).map((t) => (
            <TrendingCard key={t.id} item={t} onClick={() => go(t.claim)} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
