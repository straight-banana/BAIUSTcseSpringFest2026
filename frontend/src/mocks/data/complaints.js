// Mock data for Mission 1 — Anonymous Whistleblower (Phase 4 expanded)

export const CATEGORIES = [
  { value: 'attendance_manipulation', label: 'Attendance Manipulation', tone: 'warning' },
  { value: 'unfair_grading',          label: 'Unfair Grading',          tone: 'warning' },
  { value: 'harassment',              label: 'Harassment',              tone: 'danger'  },
  { value: 'classroom_misconduct',    label: 'Classroom Misconduct',    tone: 'brand'   },
  { value: 'academic_dishonesty',     label: 'Academic Dishonesty',     tone: 'brand'   },
  { value: 'abuse_of_authority',      label: 'Abuse of Authority',      tone: 'danger'  },
  { value: 'corruption',              label: 'Corruption',              tone: 'danger'  },
  { value: 'other',                   label: 'Other',                   tone: 'neutral' },
];

export const STATUSES = [
  { value: 'pending',       label: 'Pending',       tone: 'neutral' },
  { value: 'under_review',  label: 'Under Review',  tone: 'warning' },
  { value: 'investigating', label: 'Investigating', tone: 'brand'   },
  { value: 'resolved',      label: 'Resolved',      tone: 'success' },
  { value: 'rejected',      label: 'Rejected',      tone: 'danger'  },
];

export const findCategory = (v) => CATEGORIES.find((c) => c.value === v) || CATEGORIES[7];
export const findStatus   = (v) => STATUSES.find((s) => s.value === v)   || STATUSES[0];

// Warning levels for the Strike Counter dashboard
export const WARNING_LEVELS = [
  { key: 'safe',        label: 'Safe',        tone: 'success', min: 0,  max: 24  },
  { key: 'observation', label: 'Observation', tone: 'brand',   min: 25, max: 49  },
  { key: 'warning',     label: 'Warning',     tone: 'warning', min: 50, max: 74  },
  { key: 'critical',    label: 'Critical',    tone: 'danger',  min: 75, max: 100 },
];
export const warningLevelFor = (pct) =>
  WARNING_LEVELS.find((w) => pct >= w.min && pct <= w.max) || WARNING_LEVELS[0];

export const COURSES = [
  { code: 'CSE 2101', name: 'Data Structures' },
  { code: 'CSE 2201', name: 'Algorithms' },
  { code: 'CSE 2103', name: 'Discrete Mathematics' },
  { code: 'CSE 3101', name: 'Operating Systems' },
  { code: 'CSE 3203', name: 'Database Systems' },
  { code: 'EEE 1101', name: 'Basic Electrical Engineering' },
  { code: 'MATH 1103', name: 'Calculus & Analytic Geometry' },
  { code: 'ENG 1101', name: 'English Communication' },
];

export const TEACHERS = [
  'Rashid Sir', 'Nusrat Ma’am', 'Kabir Sir', 'Salma Ma’am',
  'Imran Sir', 'Farhana Ma’am', 'Anonymous',
];

export const CLASSROOMS = ['Room 101', 'Room 202', 'Lab A', 'Lab B', 'Auditorium', 'Corridor', 'Library'];

const titles = [
  'Attendance signed for absent students',
  'Marks reduced without explanation',
  'Verbal harassment during class break',
  'Phone used during exam without action taken',
  'Copying tolerated for select students',
  'Prefect misusing captain privileges',
  '2-taka toll collected from every student',
  'Reading list changed the night before exam',
  'Locker tiffin stolen again',
  'Bribe requested for signing lab report',
];
const bodies = [
  'It happened after the second period, right by the north corridor.',
  'Multiple students confirm the same incident this week.',
  'The change was announced verbally with no written notice.',
  'Evidence attached. Please review before the assembly.',
  'This has been ongoing for at least three weeks now.',
  'The victim asked to stay anonymous but confirmed the facts.',
];

const rand = (n) => Math.floor(Math.random() * n);
const pad4 = (n) => String(n).padStart(4, '0');
const YEAR = new Date().getFullYear();

const seed = Array.from({ length: 30 }, (_, i) => {
  const cat = CATEGORIES[rand(CATEGORIES.length)];
  const stat = STATUSES[rand(STATUSES.length)];
  const course = COURSES[rand(COURSES.length)];
  const submitted = new Date();
  submitted.setDate(submitted.getDate() - rand(60));
  submitted.setHours(rand(24), rand(60), 0, 0);
  const updated = new Date(submitted);
  updated.setDate(updated.getDate() + rand(6));

  // strike weight only meaningful when resolved/investigating
  const weight =
    stat.value === 'resolved'      ? 1 + rand(3) :   // 1..3
    stat.value === 'investigating' ? 1 + rand(2) :
    0;

  return {
    id: `CMP-${YEAR}-${pad4(41 + i)}`,
    title: titles[rand(titles.length)],
    subject: titles[rand(titles.length)],
    description: bodies[rand(bodies.length)],
    category: cat.value,
    status: stat.value,
    course: course.name,
    courseCode: course.code,
    teacher: TEACHERS[rand(TEACHERS.length)],
    classroom: CLASSROOMS[rand(CLASSROOMS.length)],
    incidentDate: submitted.toISOString().slice(0, 10),
    incidentTime: `${String(submitted.getHours()).padStart(2, '0')}:${String(submitted.getMinutes()).padStart(2, '0')}`,
    submittedAt: submitted.toISOString(),
    lastUpdated: updated.toISOString(),
    strikeWeight: weight,
    evidenceCount: rand(4),
    hasEvidence: Math.random() > 0.4,
    anonymous: true,
  };
});

export const complaints = seed.sort(
  (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
);

// ---------- Aggregates ----------
const countBy = (arr, k, v) => arr.filter((x) => x[k] === v).length;

export const complaintStats = {
  total:         complaints.length,
  pending:       countBy(complaints, 'status', 'pending'),
  underReview:   countBy(complaints, 'status', 'under_review'),
  investigating: countBy(complaints, 'status', 'investigating'),
  resolved:      countBy(complaints, 'status', 'resolved'),
  rejected:      countBy(complaints, 'status', 'rejected'),
  critical:      complaints.filter((c) => c.strikeWeight >= 3).length,
  avgResolutionHours: 32,
};

export const categoryDistribution = CATEGORIES.map((c) => ({
  name: c.label, key: c.value,
  value: countBy(complaints, 'category', c.value),
}));

export const statusDistribution = STATUSES.map((s) => ({
  name: s.label, key: s.value,
  value: countBy(complaints, 'status', s.value),
}));

export const complaintsOverTime = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  complaints: 2 + rand(9),
  resolved: 1 + rand(5),
}));

export const monthlyTrend = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug']
  .map((m) => ({ month: m, count: 8 + rand(24), resolved: 5 + rand(18) }));

export const strikeDistribution = [0, 1, 2, 3].map((n) => ({
  weight: `${n}`,
  count: complaints.filter((c) => c.strikeWeight === n).length,
}));

export const resolutionRate = monthlyTrend.map((m) => ({
  month: m.month,
  rate: Math.round((m.resolved / m.count) * 100),
}));

// ---------- Student context (mock — no auth) ----------
const totalStrikeWeight = complaints
  .filter((c) => c.status === 'resolved')
  .reduce((sum, c) => sum + (c.strikeWeight || 0), 0);
const STRIKE_CAP = 100;
const strikePct = Math.min(100, Math.round((totalStrikeWeight / STRIKE_CAP) * 100));

export const strikeSummary = {
  validComplaints: complaints.filter((c) => c.status === 'resolved').length,
  totalStrikes: totalStrikeWeight,
  strikeCap: STRIKE_CAP,
  strikePercent: strikePct,
  warningLevel: warningLevelFor(strikePct),
};

export const currentStudent = {
  anonymousHandle: 'STU-9E7A',
  totalSubmitted: 4,
  strikesIssued: 2,
  latest: complaints[0],
  recent: complaints.slice(0, 4),
};

export const recentDecisions = complaints
  .filter((c) => c.status === 'resolved' || c.status === 'rejected')
  .slice(0, 5)
  .map((c) => ({
    id: c.id,
    category: c.category,
    decision: c.status,
    when: new Date(c.lastUpdated).toLocaleDateString(),
  }));

export const generateReferenceId = () =>
  `CMP-${YEAR}-${pad4(Math.floor(1000 + Math.random() * 8999))}`;
