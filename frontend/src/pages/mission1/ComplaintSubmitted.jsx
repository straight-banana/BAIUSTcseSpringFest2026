import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import CategoryBadge from '../../components/mission1/CategoryBadge.jsx';
import { CheckCircle2, Copy, History, Plus, ShieldCheck, EyeOff } from 'lucide-react';
import { useToast } from '../../components/feedback/Toast.jsx';
import { generateReferenceId } from '../../mocks/data/complaints.js';

export default function ComplaintSubmitted() {
  const { state } = useLocation();
  const toast = useToast();
  const referenceId = state?.referenceId || generateReferenceId();
  const category = state?.category;
  const anonymous = state?.anonymous ?? true;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      toast.push({ tone: 'success', title: 'Reference ID copied' });
    } catch {
      toast.push({ tone: 'error', title: 'Copy failed' });
    }
  };

  return (
    <PageContainer>
      <div className="max-w-xl mx-auto">
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="mx-auto h-20 w-20 rounded-full bg-success/10 text-success flex items-center justify-center"
          >
            <CheckCircle2 size={38} />
          </motion.div>

          <h1 className="mt-5 text-xl font-semibold text-fg">Complaint submitted successfully</h1>
          <p className="mt-2 text-sm text-muted">
            Thank you for speaking up. Your report is queued for review and will be handled
            confidentially. Save the anonymous ID below to track it later.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 rounded-xl border border-border bg-surface p-4"
          >
            <p className="text-[11px] uppercase tracking-wider text-muted font-mono">Anonymous ID</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="font-mono text-2xl font-semibold text-fg">{referenceId}</span>
              <button
                onClick={copy}
                aria-label="Copy reference ID"
                className="p-1.5 rounded-md text-muted hover:text-fg hover:bg-elevated"
              >
                <Copy size={14} />
              </button>
            </div>
            {category && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
                Category: <CategoryBadge category={category} />
              </div>
            )}
          </motion.div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="rounded-lg border border-border p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted font-mono">Est. Review Time</p>
              <p className="text-sm font-semibold text-fg mt-1">24–48 hours</p>
            </div>
            <div className="rounded-lg border border-border p-3 flex items-center gap-2">
              {anonymous
                ? <EyeOff size={14} className="text-brand shrink-0" />
                : <ShieldCheck size={14} className="text-brand shrink-0" />}
              <p className="text-xs text-muted">
                {anonymous
                  ? <>Filed <span className="text-fg font-medium">anonymously</span> — unlinkable to you.</>
                  : <>Filed with your handle — only reviewers can see it.</>}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/mission-1/history">
              <Button variant="outline" leftIcon={<History size={14} />}>View Complaint History</Button>
            </Link>
            <Link to="/mission-1/submit">
              <Button leftIcon={<Plus size={14} />}>Submit Another Complaint</Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
