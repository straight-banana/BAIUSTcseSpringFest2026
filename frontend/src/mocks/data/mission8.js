// Mission 8 — Captain Recommendation Engine mock data

export const SCORE_WEIGHTS = [
  { key: 'leadership',     label: 'Leadership',     weight: 0.22 },
  { key: 'communication',  label: 'Communication',  weight: 0.14 },
  { key: 'responsibility', label: 'Responsibility', weight: 0.14 },
  { key: 'discipline',     label: 'Discipline',     weight: 0.12 },
  { key: 'attendance',     label: 'Attendance',     weight: 0.10 },
  { key: 'participation',  label: 'Participation',  weight: 0.14 },
  { key: 'peerFeedback',   label: 'Peer Feedback',  weight: 0.14 },
];

const FIRST = ['Abdus','Sadia','Ishtiak','Hrithik','Rafiq','Nafisa','Tanvir','Mahira','Sabbir','Fariha','Rashed','Nadia','Junayed','Anika','Rehan','Mim','Shafin','Rumi','Kabir','Tasnim'];
const LAST  = ['Salam','Rashid','Ahmed','Bhowmik','Chowdhury','Khan','Islam','Hasan','Karim','Sultana','Reza','Haque','Uddin','Sarker','Alam','Nabi','Alvi','Roy','Miah','Rahman'];
const DEPTS = ['CSE', 'EEE', 'CE', 'ME', 'TE'];

function rnd(seed) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function makeScores(i) {
  const base = 60 + rnd(i * 3) * 30;
  const s = {};
  SCORE_WEIGHTS.forEach((c, j) => {
    s[c.key] = Math.round(Math.min(99, Math.max(40, base + (rnd(i * 7 + j) - 0.5) * 25)));
  });
  const overall = +SCORE_WEIGHTS.reduce((sum, c) => sum + s[c.key] * c.weight, 0).toFixed(1);
  return { ...s, overall };
}

const BADGES = ['Elite Leader', 'Rising Star', 'Team Anchor', 'Consistent', 'Watchlist'];

export const CANDIDATES = Array.from({ length: 22 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 3) % LAST.length];
  const scores = makeScores(i + 1);
  const status =
    scores.overall >= 82 ? 'recommended' :
    scores.overall >= 72 ? 'watch' :
    scores.overall >= 62 ? 'pending' : 'not-eligible';
  return {
    id: `cand-${i + 1}`,
    name: `${first} ${last}`,
    roll: `2201${String(100 + i).padStart(3, '0')}`,
    department: DEPTS[i % DEPTS.length],
    section: ['A','B','C'][i % 3],
    year: 3,
    scores,
    peerRating: +(3 + rnd(i * 5) * 2).toFixed(2),
    peerRatingCount: 12 + Math.floor(rnd(i + 2) * 40),
    attendancePct: 70 + Math.floor(rnd(i + 3) * 30),
    cgpa: +(2.8 + rnd(i + 4) * 1.2).toFixed(2),
    participationEvents: 3 + Math.floor(rnd(i + 5) * 12),
    achievements: [
      i % 2 === 0 && 'Class Rep',
      i % 3 === 0 && 'Debate Winner',
      i % 4 === 0 && 'Hackathon Champ',
      i % 5 === 0 && 'Sports Captain',
    ].filter(Boolean),
    badge: BADGES[i % BADGES.length],
    status,
    review: i % 6 === 0 ? 'approved' : i % 6 === 1 ? 'rejected' : 'pending',
    strengths: [
      'Confident public speaker',
      'Organizes team logistics well',
      'Reliable under deadline pressure',
    ],
    improvements: [
      'Delegate small tasks more often',
      'Increase attendance in optional sessions',
      'Give more written feedback',
    ],
    timeline: [
      { date: '2025-08-10', event: 'Elected Group Lead — DBMS Lab' },
      { date: '2025-09-22', event: 'Led IEEE volunteer team of 8' },
      { date: '2025-11-05', event: 'Mentored 3 juniors in DSA' },
      { date: '2026-01-14', event: 'Nominated as Captain candidate' },
    ],
    notes: '',
  };
});

export const CURRENT_ROUND = {
  id: 'R-2026-01',
  name: 'Spring 2026 — Round 1',
  opened: '2026-01-10',
  closes: '2026-02-15',
  reviewers: 4,
};

export const HISTORY_ROUNDS = [
  { id: 'R-2025-04', name: 'Fall 2025 — Round 2', date: '2025-11-20', recommended: 8, approved: 5, rejected: 3, status: 'closed' },
  { id: 'R-2025-03', name: 'Fall 2025 — Round 1', date: '2025-09-05', recommended: 10, approved: 6, rejected: 4, status: 'closed' },
  { id: 'R-2025-02', name: 'Spring 2025 — Round 2', date: '2025-04-18', recommended: 7, approved: 5, rejected: 2, status: 'closed' },
  { id: 'R-2025-01', name: 'Spring 2025 — Round 1', date: '2025-02-02', recommended: 9, approved: 4, rejected: 5, status: 'closed' },
  { id: 'R-2024-04', name: 'Fall 2024 — Round 2', date: '2024-11-12', recommended: 8, approved: 6, rejected: 2, status: 'closed' },
  { id: 'R-2026-01', name: 'Spring 2026 — Round 1', date: '2026-01-10', recommended: 6, approved: 0, rejected: 0, status: 'open' },
];

export const SCORE_DISTRIBUTION = [
  { name: '90–100', value: 3 },
  { name: '80–89',  value: 6 },
  { name: '70–79',  value: 7 },
  { name: '60–69',  value: 4 },
  { name: '<60',    value: 2 },
];

export const LEADERSHIP_TREND = ['Aug','Sep','Oct','Nov','Dec','Jan'].map((m, i) => ({
  day: m,
  score: +(70 + rnd(i + 1) * 15).toFixed(1),
  participation: +(60 + rnd(i + 2) * 25).toFixed(1),
}));

export const DEPT_STATS = DEPTS.map((d, i) => ({
  name: d,
  candidates: 3 + Math.floor(rnd(i + 9) * 6),
  avgScore: +(70 + rnd(i + 11) * 15).toFixed(1),
}));

export const SELECTION_STATS = [
  { name: 'Recommended', value: CANDIDATES.filter((c) => c.status === 'recommended').length },
  { name: 'Watchlist',   value: CANDIDATES.filter((c) => c.status === 'watch').length },
  { name: 'Pending',     value: CANDIDATES.filter((c) => c.status === 'pending').length },
  { name: 'Not eligible',value: CANDIDATES.filter((c) => c.status === 'not-eligible').length },
];

export const LEADERBOARDS = {
  overall:       [...CANDIDATES].sort((a, b) => b.scores.overall - a.scores.overall).slice(0, 10),
  leadership:    [...CANDIDATES].sort((a, b) => b.scores.leadership - a.scores.leadership).slice(0, 10),
  peer:          [...CANDIDATES].sort((a, b) => b.peerRating - a.peerRating).slice(0, 10),
  participation: [...CANDIDATES].sort((a, b) => b.scores.participation - a.scores.participation).slice(0, 10),
  mostRecommended:[...CANDIDATES].filter((c) => c.status === 'recommended').sort((a, b) => b.scores.overall - a.scores.overall).slice(0, 10),
};

export function getCandidateById(id) {
  return CANDIDATES.find((c) => c.id === id) || CANDIDATES[0];
}
