// Mission 7 — Peer Rating System mock data

export const RATING_CATEGORIES = [
  { key: 'leadership',     label: 'Leadership' },
  { key: 'teamwork',       label: 'Teamwork' },
  { key: 'communication',  label: 'Communication' },
  { key: 'responsibility', label: 'Responsibility' },
  { key: 'discipline',     label: 'Discipline' },
  { key: 'problemSolving', label: 'Problem Solving' },
  { key: 'overall',        label: 'Overall Performance' },
];

const FIRST = ['Abdus','Sadia','Ishtiak','Hrithik','Rafiq','Nafisa','Tanvir','Mahira','Sabbir','Fariha','Rashed','Nadia','Junayed','Anika','Rehan','Mim','Shafin','Rumi','Kabir','Tasnim'];
const LAST  = ['Salam','Rashid','Ahmed','Bhowmik','Chowdhury','Khan','Islam','Hasan','Karim','Sultana','Reza','Haque','Uddin','Sarker','Alam','Nabi','Alvi','Roy','Miah','Rahman'];

function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const STUDENTS = Array.from({ length: 24 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 3) % LAST.length];
  const roll = `2201${String(100 + i).padStart(3, '0')}`;
  const ratings = {};
  RATING_CATEGORIES.forEach((c, j) => {
    ratings[c.key] = +(3 + seededRand(i * 7 + j) * 2).toFixed(1);
  });
  const overall = +(
    (ratings.leadership + ratings.teamwork + ratings.communication + ratings.responsibility + ratings.discipline + ratings.problemSolving + ratings.overall) / 7
  ).toFixed(2);
  return {
    id: `stu-${i + 1}`,
    name: `${first} ${last}`,
    roll,
    department: 'CSE',
    section: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C',
    year: 3,
    avatarColor: ['brand','accent','success','warning','danger'][i % 5],
    ratings,
    overall,
    totalRatings: 12 + ((i * 7) % 40),
    leadershipBadge: ratings.leadership >= 4.5 ? 'Elite Leader' : ratings.leadership >= 4 ? 'Emerging Leader' : null,
    achievements: [
      i % 2 === 0 && 'Project Lead',
      i % 3 === 0 && 'Debate Champ',
      i % 4 === 0 && 'Hackathon Winner',
    ].filter(Boolean),
  };
});

export const CURRENT_USER = STUDENTS[0];

export const COMMENTS = Array.from({ length: 32 }, (_, i) => {
  const stu = STUDENTS[i % STUDENTS.length];
  const cat = RATING_CATEGORIES[i % RATING_CATEGORIES.length];
  const bodies = [
    'Really steps up during group projects and keeps everyone aligned.',
    'Communicates clearly, always polite in class discussions.',
    'Sometimes misses deadlines but overall reliable.',
    'A calm presence who defuses tense moments in team meetings.',
    'Strong technical skills but should share knowledge more.',
    'Volunteers for tough tasks. A quiet backbone of the class.',
    'Punctual and disciplined. Sets a good example.',
    'Needs to speak up more during viva and presentations.',
  ];
  return {
    id: `cm-${i + 1}`,
    studentId: stu.id,
    studentName: stu.name,
    category: cat.key,
    categoryLabel: cat.label,
    body: bodies[i % bodies.length],
    createdAt: new Date(Date.now() - i * 3.6e6 * 6).toISOString(),
    helpful: (i * 3) % 24,
    status: i % 9 === 0 ? 'pending' : i % 11 === 0 ? 'flagged' : 'approved',
  };
});

export const RECENT_ACTIVITY = COMMENTS.slice(0, 6).map((c) => ({
  id: c.id,
  text: `Anonymous rating submitted for ${c.studentName}`,
  time: c.createdAt,
  category: c.categoryLabel,
}));

export const MY_RATINGS = Array.from({ length: 14 }, (_, i) => {
  const stu = STUDENTS[(i + 3) % STUDENTS.length];
  return {
    id: `mr-${i + 1}`,
    date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    studentId: stu.id,
    studentName: stu.name,
    roll: stu.roll,
    overall: +(3 + seededRand(i * 11) * 2).toFixed(1),
    status: i % 7 === 0 ? 'pending' : 'approved',
    commentPreview: 'Solid teammate — good at breaking down problems...',
  };
});

export const MONTHLY_TRENDS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
  day: m,
  avg: +(3.5 + seededRand(i + 1) * 1.2).toFixed(2),
  submissions: 40 + Math.floor(seededRand(i + 2) * 80),
}));

export const CATEGORY_PERFORMANCE = RATING_CATEGORIES.map((c, i) => ({
  name: c.label,
  score: +(3.4 + seededRand(i + 5) * 1.4).toFixed(2),
}));

export const RATING_DISTRIBUTION = [
  { name: '5 ★', value: 42 },
  { name: '4 ★', value: 78 },
  { name: '3 ★', value: 55 },
  { name: '2 ★', value: 18 },
  { name: '1 ★', value: 7 },
];

export const LEADERBOARDS = {
  overall:      [...STUDENTS].sort((a, b) => b.overall - a.overall).slice(0, 10),
  leadership:   [...STUDENTS].sort((a, b) => b.ratings.leadership - a.ratings.leadership).slice(0, 10),
  teamwork:     [...STUDENTS].sort((a, b) => b.ratings.teamwork - a.ratings.teamwork).slice(0, 10),
  communication:[...STUDENTS].sort((a, b) => b.ratings.communication - a.ratings.communication).slice(0, 10),
  mostImproved: [...STUDENTS].sort((a, b) => (b.ratings.discipline - a.ratings.discipline)).slice(0, 10),
};

export const MODERATION_QUEUE = COMMENTS.filter((c) => c.status !== 'approved').slice(0, 12);

export function getStudentById(id) {
  return STUDENTS.find((s) => s.id === id) || STUDENTS[0];
}

export function getCommentsFor(studentId) {
  return COMMENTS.filter((c) => c.studentId === studentId);
}
