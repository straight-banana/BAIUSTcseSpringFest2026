import { useState } from 'react';
import Card from '../common/Card.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';
import { RATES } from '../../mocks/data/mission4.js';
import { ArrowRightLeft } from 'lucide-react';

export default function CurrencyWidget({ initialAmount = 1000 }) {
  const [amount, setAmount] = useState(initialAmount);
  const [to, setTo] = useState('USD');
  const converted = (amount * RATES[to]).toFixed(2);

  return (
    <Card className="p-5">
      <SectionHeader
        title="Currency Widget"
        description="Convert class funds into other units (mock rates)."
      />
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[11px] uppercase text-subtle">From (BDT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="mt-1 w-full h-10 rounded-md border border-border bg-surface px-3 text-sm text-fg focus:border-brand outline-none"
          />
        </div>
        <ArrowRightLeft size={16} className="text-muted mt-5" />
        <div className="flex-1">
          <label className="text-[11px] uppercase text-subtle">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full h-10 rounded-md border border-border bg-surface px-2 text-sm text-fg focus:border-brand outline-none"
          >
            {Object.keys(RATES).filter((k) => k !== 'BDT').map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-border bg-brand-soft/50 p-3">
        <p className="text-[11px] uppercase text-subtle">Converted</p>
        <p className="text-xl font-semibold text-fg">{converted} <span className="text-sm text-muted">{to}</span></p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
        <div className="rounded-md bg-surface p-2">🍔 ≈ {Math.floor(amount / 120)} burgers</div>
        <div className="rounded-md bg-surface p-2">🏏 ≈ {Math.floor(amount / 850)} cricket bats</div>
        <div className="rounded-md bg-surface p-2">🌶️ ≈ {Math.floor(amount / 20)} jhalmuri</div>
        <div className="rounded-md bg-surface p-2">🍵 ≈ {Math.floor(amount / 12)} milk tea</div>
      </div>
    </Card>
  );
}
