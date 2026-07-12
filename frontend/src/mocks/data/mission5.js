// Mission 5 — SOS Rescue Flare mock data

export const LOCATIONS = [
  { key: 'classroom',  label: 'Classroom',  icon: '🏫' },
  { key: 'library',    label: 'Library',    icon: '📚' },
  { key: 'playground', label: 'Playground', icon: '⚽' },
  { key: 'corridor',   label: 'Corridor',   icon: '🚪' },
  { key: 'canteen',    label: 'Canteen',    icon: '🍽️' },
  { key: 'laboratory', label: 'Laboratory', icon: '🧪' },
  { key: 'auditorium', label: 'Auditorium', icon: '🎭' },
  { key: 'other',      label: 'Other',      icon: '📍' },
];

export const EMERGENCY_TYPES = [
  { key: 'bullying',  label: 'Bullying',        icon: '👊' },
  { key: 'injury',    label: 'Injury',          icon: '🩹' },
  { key: 'medical',   label: 'Medical',         icon: '💊' },
  { key: 'harass',    label: 'Harassment',      icon: '🚫' },
  { key: 'theft',     label: 'Theft',           icon: '🕵️' },
  { key: 'fight',     label: 'Fight',           icon: '⚡' },
  { key: 'lost',      label: 'Lost / Missing',  icon: '❓' },
  { key: 'other',     label: 'Other',           icon: '🔔' },
];

export const SEVERITIES = [
  { key: 'critical', label: 'Critical', tone: 'danger',  color: '#C62828' },
  { key: 'high',     label: 'High',     tone: 'warning', color: '#FF8F00' },
  { key: 'medium',   label: 'Medium',   tone: 'warning', color: '#FBC02D' },
  { key: 'low',      label: 'Low',      tone: 'success', color: '#4C8C2B' },
];

export const STATUSES = [
  { key: 'pending',    label: 'Pending',    tone: 'warning' },
  { key: 'received',   label: 'Received',   tone: 'brand'   },
  { key: 'responding', label: 'Responding', tone: 'brand'   },
  { key: 'resolved',   label: 'Resolved',   tone: 'success' },
  { key: 'cancelled',  label: 'Cancelled',  tone: 'neutral' },
];

export const findLocation = (k) => LOCATIONS.find((x) => x.key === k) ?? LOCATIONS[0];
export const findType     = (k) => EMERGENCY_TYPES.find((x) => x.key === k) ?? EMERGENCY_TYPES[0];
export const findSeverity = (k) => SEVERITIES.find((x) => x.key === k) ?? SEVERITIES[2];
export const findStatus   = (k) => STATUSES.find((x) => x.key === k) ?? STATUSES[0];

const students  = ['Anon-2411', 'Anon-2418', 'Anon-2402', 'Anon-2394', 'Anon-2377', 'Anon-2361'];
const captains  = ['Sadia (V-Captain)', 'Ishtiak', 'Hrithik', 'Kuddus (Captain)'];
const rand = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rand(a.length)];

function seed() {
  const list = [];
  const now = new Date('2026-03-14T10:30:00');
  for (let i = 0; i < 26; i++) {
    const loc = pick(LOCATIONS);
    const type = pick(EMERGENCY_TYPES);
    const sev = pick(SEVERITIES);
    const d = new Date(now);
    d.setMinutes(now.getMinutes() - i * 47 - rand(30));
    const status = i < 3 ? pick(['pending','received']) : i < 8 ? 'responding' : pick(['resolved','resolved','resolved','cancelled']);
    list.push({
      id: `SOS-2026-${(2000 + i).toString()}`,
      time: d.toISOString(),
      student: pick(students),
      location: loc.key,
      type: type.key,
      severity: sev.key,
      status,
      captain: status === 'pending' ? null : pick(captains),
      description: descFor(type.key, loc.label),
      note: pick(['—', 'Second floor', 'Near the water fountain', 'Behind the library', 'Ground floor entrance']),
    });
  }
  return list;
}

function descFor(type, loc) {
  const map = {
    bullying: `Verbal bullying reported in the ${loc.toLowerCase()}`,
    injury:   `Student fell down in the ${loc.toLowerCase()}, minor injury`,
    medical:  `Student feeling unwell in the ${loc.toLowerCase()}`,
    harass:   `Harassment complaint from ${loc.toLowerCase()}`,
    theft:    `Missing item reported near ${loc.toLowerCase()}`,
    fight:    `Physical altercation at ${loc.toLowerCase()}`,
    lost:     `Junior student lost near ${loc.toLowerCase()}`,
    other:    `Unspecified emergency at ${loc.toLowerCase()}`,
  };
  return map[type];
}

export const ALERTS = seed();

export const CURRENT_STUDENT_HISTORY = ALERTS.slice(0, 6).map((a, i) => ({
  ...a,
  student: 'You (Anon-2411)',
  status: i === 0 ? 'responding' : i === 1 ? 'received' : pick(['resolved','resolved','cancelled']),
}));

export const SUMMARY = {
  active: ALERTS.filter((a) => ['pending','received','responding'].includes(a.status)).length,
  pending: ALERTS.filter((a) => a.status === 'pending').length,
  resolved: ALERTS.filter((a) => a.status === 'resolved').length,
  avgResponse: '3m 42s',
  total: ALERTS.length,
};

export const BY_LOCATION = LOCATIONS.map((l) => ({
  name: l.label,
  value: ALERTS.filter((a) => a.location === l.key).length || 1,
}));

export const BY_TYPE = EMERGENCY_TYPES.map((t) => ({
  name: t.label,
  value: ALERTS.filter((a) => a.type === t.key).length || 1,
}));

export const RESPONSE_TIME = [
  { day: 'Mon', minutes: 4.2 },
  { day: 'Tue', minutes: 3.8 },
  { day: 'Wed', minutes: 5.1 },
  { day: 'Thu', minutes: 3.2 },
  { day: 'Fri', minutes: 2.9 },
  { day: 'Sat', minutes: 3.7 },
  { day: 'Sun', minutes: 4.5 },
];

export const PEAK_HOURS = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i + 8}:00`,
  alerts: Math.max(0, Math.round(Math.sin(i / 2) * 5 + 6 + rand(3))),
}));

export const MONTHLY_TREND = [
  { month: 'Oct', alerts: 12, resolved: 10 },
  { month: 'Nov', alerts: 18, resolved: 16 },
  { month: 'Dec', alerts:  9, resolved:  9 },
  { month: 'Jan', alerts: 22, resolved: 19 },
  { month: 'Feb', alerts: 27, resolved: 24 },
  { month: 'Mar', alerts: SUMMARY.total, resolved: SUMMARY.resolved },
];

export const MAP_PINS = [
  { x: 22, y: 30, loc: 'library',    active: false },
  { x: 55, y: 20, loc: 'classroom',  active: true  },
  { x: 78, y: 42, loc: 'laboratory', active: false },
  { x: 40, y: 55, loc: 'corridor',   active: true  },
  { x: 68, y: 72, loc: 'canteen',    active: false },
  { x: 15, y: 78, loc: 'playground', active: true  },
  { x: 85, y: 80, loc: 'auditorium', active: false },
];

export const NOTIFICATIONS = [
  { id: 'n1', kind: 'new',       title: 'New SOS received',       body: 'SOS-2026-2025 · Classroom',      when: '2 min ago',   tone: 'danger',  read: false },
  { id: 'n2', kind: 'accepted',  title: 'Captain accepted alert', body: 'Sadia accepted SOS-2026-2024',   when: '6 min ago',   tone: 'brand',   read: false },
  { id: 'n3', kind: 'resolved',  title: 'Alert resolved',         body: 'SOS-2026-2020 marked resolved',  when: '32 min ago',  tone: 'success', read: true  },
  { id: 'n4', kind: 'closed',    title: 'Emergency closed',       body: 'SOS-2026-2018 archived',         when: '1 hr ago',    tone: 'neutral', read: true  },
  { id: 'n5', kind: 'new',       title: 'New SOS received',       body: 'SOS-2026-2017 · Playground',     when: '2 hr ago',    tone: 'danger',  read: true  },
];

export const EMERGENCY_TIPS = [
  'Stay calm and describe the location clearly.',
  'Do not confront aggressors — request backup first.',
  'If injured, remain still until help arrives.',
  'Keep your phone accessible for follow-up questions.',
  'Only press SOS for genuine emergencies.',
];
