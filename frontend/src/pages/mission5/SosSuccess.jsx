import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Send, Clock, MapPin } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { findLocation, EMERGENCY_TIPS } from '../../mocks/data/mission5.js';

export default function SosSuccess() {
  const state = useLocation().state || {};
  const loc = findLocation(state.location || 'classroom');
  const id = `SOS-2026-${(2100 + Math.floor(Math.random() * 800)).toString()}`;

  return (
    <PageContainer>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-8 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto h-20 w-20 rounded-full bg-success/15 text-success flex items-center justify-center mb-4"
          >
            <CheckCircle2 size={44} />
          </motion.div>
          <h1 className="text-2xl font-semibold text-fg tracking-tight">SOS Sent Successfully</h1>
          <p className="text-sm text-muted mt-1">Captains have been notified and are on the way.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Info label="Alert ID" value={<span className="font-mono">{id}</span>} />
            <Info label="Location" value={<><MapPin size={12} className="inline mr-1" /> {loc.icon} {loc.label}</>} />
            <Info label="Response ETA" value={<><Clock size={12} className="inline mr-1" /> ~ 3 min</>} />
          </div>

          <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-left">
            <p className="text-xs uppercase text-subtle mb-2">While you wait</p>
            <ul className="space-y-1.5 text-sm text-fg">
              {EMERGENCY_TIPS.slice(0, 3).map((t, i) => (
                <li key={i} className="flex gap-2"><span className="text-brand">•</span> {t}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/mission-5"><Button variant="outline" leftIcon={<Home size={14} />}>Return Dashboard</Button></Link>
            <Link to="/mission-5/report"><Button variant="danger" leftIcon={<Send size={14} />}>Send Another Alert</Button></Link>
          </div>
        </Card>
      </motion.div>
    </PageContainer>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-[10px] uppercase text-subtle">{label}</p>
      <p className="text-sm font-semibold text-fg mt-1">{value}</p>
    </div>
  );
}
