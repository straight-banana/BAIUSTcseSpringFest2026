import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Download, Calendar } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Button from '../../components/common/Button.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import RuleCard from '../../components/mission6/RuleCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { RULES, findCategory } from '../../mocks/data/mission6.js';

export default function RuleDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const rule = RULES.find((r) => r.id === id);
  const [saved, setSaved] = useState(false);

  if (!rule) {
    return (
      <PageContainer>
        <Mission6SubNav />
        <EmptyState title="Rule not found" message="The rule you're looking for doesn't exist." action={
          <Button onClick={() => nav('/mission-6/rules')} leftIcon={<ArrowLeft size={14} />}>Back to Rulebook</Button>
        } />
      </PageContainer>
    );
  }

  const cat = findCategory(rule.category);
  const related = RULES.filter((r) => r.category === rule.category && r.id !== rule.id).slice(0, 3);

  return (
    <PageContainer>
      <PageHeader
        title={rule.title}
        subtitle={`${cat.label} · ${rule.number}`}
        icon={<span className="text-lg">{cat.icon}</span>}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => nav('/mission-6/rules')}>Back</Button>
        }
      />
      <Mission6SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: `${cat.color}18`, color: cat.color }}
              >
                {cat.icon} {cat.label}
              </span>
              <div className="flex items-center gap-1">
                <Button size="sm" variant={saved ? 'primary' : 'secondary'} leftIcon={<Bookmark size={14} />} onClick={() => setSaved(!saved)}>
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button size="sm" variant="ghost" leftIcon={<Share2 size={14} />}>Share</Button>
                <Button size="sm" variant="ghost" leftIcon={<Download size={14} />}>PDF</Button>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-fg">Overview</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">{rule.summary}</p>
            <h3 className="mt-6 text-sm font-semibold text-fg">Full text</h3>
            <p className="mt-2 text-sm text-fg leading-relaxed whitespace-pre-line">{rule.body}</p>

            <h3 className="mt-6 text-sm font-semibold text-fg">Examples</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted space-y-1">
              <li>A student who violates this rule will receive a formal warning.</li>
              <li>Repeated violations are escalated to the discipline committee.</li>
              <li>Exceptions require written approval from the department chair.</li>
            </ul>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-muted">
              <Calendar size={12} /> Last updated {rule.updated}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Related rules" description={`More from ${cat.label}`} />
            <div className="space-y-3">
              {related.map((r) => <RuleCard key={r.id} rule={r} />)}
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Fact check" description="Verify a claim about this rule" />
            <Link
              to={`/mission-6/result?q=${encodeURIComponent(rule.title)}`}
              className="block rounded-lg border border-border bg-surface p-3 text-sm text-fg hover:bg-elevated hover:border-brand/50 transition"
            >
              → Check "{rule.title}"
            </Link>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
