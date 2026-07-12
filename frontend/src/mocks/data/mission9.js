// Mission 9 — Captain Voting System mock data

const FIRST = ['Abdus','Sadia','Ishtiak','Hrithik','Rafiq','Nafisa','Tanvir','Mahira','Sabbir','Fariha','Rashed','Nadia'];
const LAST  = ['Salam','Rashid','Ahmed','Bhowmik','Chowdhury','Khan','Islam','Hasan','Karim','Sultana','Reza','Haque'];
const CLASSES = ['6','7','8','9','10'];

function rnd(seed) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

const MANIFESTOS = [
  'Fair complaints, faster response — I will hold weekly open hours so every voice is heard.',
  'Transparent tiffin ledger and no more secret 2-Taka collections. Full public books, monthly review.',
  'Push for cleaner classrooms, working fans, and a real study corner in the corridor.',
  'Modernize the strike system — clearer rules, published warnings, no hidden punishments.',
  'Build a peer mentor network so nobody is left behind on syllabus or lab work.',
  'End camouflage seating for good. Everyone gets a fair line of sight, every exam.',
  'Bring back sports Saturdays. Healthy body, calm class, better focus for everyone.',
];

const GOALS = [
  'Weekly captain office hours',
  'Public tiffin & fine ledger',
  'Faster SOS response protocol',
  'Anonymous complaint drop-box',
  'Monthly transparency report',
  'Study buddy pairing program',
  'Fair seat rotation policy',
];

const STRENGTHS = ['Approachable', 'Organized', 'Fair-minded', 'Consistent', 'Empathetic', 'Level-headed', 'Diligent'];

export const CANDIDATES = Array.from({ length: 8 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last  = LAST[(i * 3) % LAST.length];
  const scores = {
    leadership:     Math.round(72 + rnd(i + 1) * 25),
    peer:           +(3.5 + rnd(i + 2) * 1.5).toFixed(2),
    academic:       Math.round(70 + rnd(i + 3) * 25),
    participation:  Math.round(65 + rnd(i + 4) * 30),
    communication:  Math.round(70 + rnd(i + 5) * 25),
    responsibility: Math.round(72 + rnd(i + 6) * 25),
  };
  const overall = Math.round((scores.leadership + scores.academic + scores.participation + scores.communication + scores.responsibility) / 5);
  const votes = 40 + Math.floor(rnd(i + 11) * 90);
  return {
    id: `cand-${i + 1}`,
    name: `${first} ${last}`,
    roll: String(101 + i).padStart(4, '0'),
    className: CLASSES[i % CLASSES.length],
    department: `Class ${CLASSES[i % CLASSES.length]}`,
    section: ['A','B','C'][i % 3],
    year: 3,
    manifesto: MANIFESTOS[i % MANIFESTOS.length],
    biography: `${first} is a Class ${CLASSES[i % CLASSES.length]} student known for calm leadership. Has helped organize class events and is active in school clubs.`,
    experience: [
      'Class Monitor — 2 terms',
      'Science Club Helper',
      'Debate Team Member',
    ].slice(0, 1 + (i % 3)),
    achievements: [
      i % 2 === 0 && 'Debate Winner 2025',
      i % 3 === 0 && 'Hackathon Runner-up',
      i % 4 === 0 && 'Dean\'s List',
      'Sports Meet Volunteer',
    ].filter(Boolean),
    strengths: STRENGTHS.slice(i % 3, (i % 3) + 3),
    goals: GOALS.slice(i % 2, (i % 2) + 4),
    scores,
    overallScore: overall,
    peerRatingCount: 18 + Math.floor(rnd(i + 8) * 40),
    recommendation: overall >= 85 ? 'strong' : overall >= 78 ? 'endorsed' : 'reviewing',
    votes,
    cgpa: +(3.2 + rnd(i + 14) * 0.8).toFixed(2),
    attendancePct: 78 + Math.floor(rnd(i + 15) * 20),
  };
});

const TOTAL_VOTES = CANDIDATES.reduce((s, c) => s + c.votes, 0);
CANDIDATES.forEach((c) => { c.votePct = +(100 * c.votes / TOTAL_VOTES).toFixed(1); });

export const ELECTION = {
  id: 'ELEC-2026-01',
  name: 'Spring 2026 Captain Election',
  status: 'active', // 'draft' | 'active' | 'paused' | 'closed' | 'published'
  opened: '2026-02-01T09:00:00',
  closes: '2026-02-20T17:00:00',
  eligibleVoters: 240,
  votesCast: TOTAL_VOTES,
  candidateCount: CANDIDATES.length,
  reviewers: 4,
  rules: [
    'One student, one vote — votes are final once submitted.',
    'Only enrolled 3rd-year students may vote in this round.',
    'Voting is anonymous. Your identity is not linked to your ballot.',
    'Ballots submitted after the deadline will not be counted.',
    'Any attempt to vote twice will invalidate both ballots.',
  ],
};

export const TURNOUT_PCT = +(100 * ELECTION.votesCast / ELECTION.eligibleVoters).toFixed(1);

export const TURNOUT_TREND = ['Feb 01','Feb 05','Feb 09','Feb 13','Feb 17','Feb 20'].map((d, i) => ({
  day: d,
  votes: Math.round(30 + i * 90 + rnd(i + 1) * 40),
  cumulative: Math.round((30 + i * 90) * (i + 1) / 2),
}));

export const DEPT_TURNOUT = CLASSES.map((d, i) => ({
  name: `Class ${d}`,
  turnout: 55 + Math.floor(rnd(i + 21) * 40),
  eligible: 40 + Math.floor(rnd(i + 22) * 20),
}));

export const HOURLY_ACTIVITY = ['9am','11am','1pm','3pm','5pm','7pm'].map((h, i) => ({
  hour: h,
  votes: Math.round(10 + rnd(i + 31) * 60),
}));

export const TIMELINE = [
  { date: '2026-01-15', label: 'Nominations opened',      status: 'done' },
  { date: '2026-01-25', label: 'Candidate review closed', status: 'done' },
  { date: '2026-02-01', label: 'Voting opens',            status: 'done' },
  { date: '2026-02-20', label: 'Voting closes',           status: 'active' },
  { date: '2026-02-22', label: 'Results published',       status: 'pending' },
  { date: '2026-02-25', label: 'Captain sworn in',        status: 'pending' },
];

export const RECENT_ACTIVITY = [
  { time: '2 min ago',  text: 'Ballot submitted from Section B' },
  { time: '11 min ago', text: 'Reviewer approved late-nomination appeal' },
  { time: '38 min ago', text: 'Turnout crossed 60% threshold' },
  { time: '1 hr ago',   text: 'System reminder sent to 42 pending voters' },
  { time: '2 hr ago',   text: 'Candidate profile updated: Sadia Rashid' },
  { time: '4 hr ago',   text: 'Admin extended voting window by 24 hours' },
];

export const HISTORY = [
  { id: 'ELEC-2025-02', year: '2025 · Fall',   winner: 'Rafiq Karim',   candidates: 7, votesCast: 198, eligible: 220, turnout: 90.0, status: 'closed' },
  { id: 'ELEC-2025-01', year: '2025 · Spring', winner: 'Mahira Alam',   candidates: 6, votesCast: 176, eligible: 210, turnout: 83.8, status: 'closed' },
  { id: 'ELEC-2024-02', year: '2024 · Fall',   winner: 'Junayed Nabi',  candidates: 8, votesCast: 189, eligible: 224, turnout: 84.4, status: 'closed' },
  { id: 'ELEC-2024-01', year: '2024 · Spring', winner: 'Anika Rahman',  candidates: 5, votesCast: 165, eligible: 205, turnout: 80.5, status: 'closed' },
  { id: 'ELEC-2023-02', year: '2023 · Fall',   winner: 'Rehan Uddin',   candidates: 6, votesCast: 172, eligible: 218, turnout: 78.9, status: 'closed' },
  { id: 'ELEC-2023-01', year: '2023 · Spring', winner: 'Tasnim Roy',    candidates: 7, votesCast: 158, eligible: 200, turnout: 79.0, status: 'closed' },
];

export function getCandidateById(id) {
  return CANDIDATES.find((c) => c.id === id) || CANDIDATES[0];
}

export function getWinner() {
  return [...CANDIDATES].sort((a, b) => b.votes - a.votes)[0];
}

export function makeVoteRef() {
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  const r = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `VOTE-2026-${t}${r}`;
}
