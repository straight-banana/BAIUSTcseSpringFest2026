// Mission 6 — Kuddus Fact Checker mock data

export const VERDICTS = {
  true:      { key: 'true',      label: 'True',           tone: 'success', color: '#4C8C2B', icon: '✓', desc: 'Verified against official rules.' },
  mostly:    { key: 'mostly',    label: 'Mostly True',    tone: 'success', color: '#7FAE5C', icon: '✓', desc: 'Largely accurate with minor nuance.' },
  partial:   { key: 'partial',   label: 'Partially True', tone: 'warning', color: '#FBC02D', icon: '½', desc: 'Contains truth but misses context.' },
  misleading:{ key: 'misleading',label: 'Misleading',     tone: 'warning', color: '#FF8F00', icon: '!', desc: 'Selectively true, overall misleading.' },
  false:     { key: 'false',     label: 'False',          tone: 'danger',  color: '#C62828', icon: '✗', desc: 'Contradicted by official rules.' },
  unverified:{ key: 'unverified',label: 'Unverified',     tone: 'neutral', color: '#808080', icon: '?', desc: 'Insufficient sources to conclude.' },
};

export const findVerdict = (k) => VERDICTS[k] ?? VERDICTS.unverified;

export const RULE_CATEGORIES = [
  { key: 'attendance',   label: 'Attendance',        icon: '📋', color: '#FF8F00' },
  { key: 'exams',        label: 'Examinations',      icon: '📝', color: '#C62828' },
  { key: 'conduct',      label: 'Classroom Conduct', icon: '🎓', color: '#4C8C2B' },
  { key: 'lab',          label: 'Laboratory',        icon: '🧪', color: '#0288D1' },
  { key: 'library',      label: 'Library',           icon: '📚', color: '#6A1B9A' },
  { key: 'finance',      label: 'Financial Policies',icon: '💰', color: '#FBC02D' },
  { key: 'scholarship',  label: 'Scholarships',      icon: '🎖️', color: '#00838F' },
  { key: 'clubs',        label: 'Student Clubs',     icon: '🎭', color: '#D81B60' },
  { key: 'hostel',       label: 'Hostel',            icon: '🏠', color: '#795548' },
  { key: 'discipline',   label: 'Discipline',        icon: '⚖️', color: '#5D4037' },
  { key: 'general',      label: 'General Policies',  icon: '📜', color: '#455A64' },
];

export const findCategory = (k) => RULE_CATEGORIES.find((c) => c.key === k) ?? RULE_CATEGORIES[10];

// ---------- RULES (100+) ----------
const ruleTemplates = [
  ['attendance', 'Minimum Attendance Requirement', '75% class attendance is mandatory for exam eligibility.'],
  ['attendance', 'Medical Leave Policy', 'Medical certificates must be submitted within 7 days.'],
  ['attendance', 'Absence Notification', 'Prolonged absence requires written notice to the department.'],
  ['attendance', 'Late Entry Rule', 'Entry after 10 minutes is marked as absent.'],
  ['exams', 'Calculator Policy', 'Only non-programmable calculators are allowed in exams.'],
  ['exams', 'Mobile Phone Ban', 'Mobile phones are strictly prohibited in the exam hall.'],
  ['exams', 'Makeup Exam Policy', 'Makeup exams are only granted with valid documentation.'],
  ['exams', 'Improvement Exam', 'Students may retake up to 2 courses per semester.'],
  ['exams', 'Grade Reappeal', 'Grade reappeals must be filed within 14 days of publication.'],
  ['conduct', 'Uniform Requirement', 'Students must wear ID cards inside campus at all times.'],
  ['conduct', 'Phone Usage in Class', 'Phones must be silent and stored during lectures.'],
  ['conduct', 'Food and Drinks', 'Food is not permitted inside classrooms except water.'],
  ['lab', 'Lab Safety Rules', 'Closed shoes and lab coats are mandatory for lab access.'],
  ['lab', 'Lab Fee Policy', 'Lab fees are non-refundable after the first two weeks.'],
  ['lab', 'Equipment Damage', 'Damaged equipment must be reported and may incur charges.'],
  ['library', 'Book Borrowing Limit', 'Undergraduate students may borrow up to 5 books at a time.'],
  ['library', 'Overdue Fine', 'Overdue fine is Tk 5 per day per book.'],
  ['library', 'Silence Policy', 'Silence must be maintained in reading zones.'],
  ['finance', 'Tuition Payment Deadline', 'Tuition must be paid before the semester registration deadline.'],
  ['finance', 'Refund Policy', 'Refunds are processed within 30 working days of application.'],
  ['finance', 'Class Rep Collection', 'CRs may only collect approved fees via receipt.'],
  ['scholarship', 'Merit Scholarship', 'Merit scholarships require CGPA of 3.75 or above.'],
  ['scholarship', 'Renewal Criteria', 'Scholarships are renewed based on semester GPA.'],
  ['clubs', 'Club Registration', 'Clubs must be registered with the Student Affairs Office annually.'],
  ['clubs', 'Event Approval', 'Campus events require approval 14 days in advance.'],
  ['hostel', 'Curfew Timing', 'Hostel entry gate closes at 10:00 PM sharp.'],
  ['hostel', 'Guest Policy', 'Guests are only permitted in the visitor lounge.'],
  ['hostel', 'Room Change Request', 'Room change requests are reviewed at semester end.'],
  ['discipline', 'Ragging Prohibition', 'Ragging in any form leads to immediate expulsion.'],
  ['discipline', 'Plagiarism Penalty', 'Plagiarism results in F grade and formal warning.'],
  ['discipline', 'Fighting Penalty', 'Physical altercations lead to suspension pending review.'],
  ['general', 'ID Card Policy', 'Lost ID must be reported within 48 hours.'],
  ['general', 'Campus Photography', 'Photography inside labs requires permission.'],
  ['general', 'Section Change', 'Section changes are allowed only in the first 2 weeks.'],
];

// pad to 100+
const RULES = [];
let idCounter = 100;
ruleTemplates.forEach((t) => {
  RULES.push({
    id: `RUL-${++idCounter}`,
    category: t[0],
    title: t[1],
    summary: t[2],
    body: t[2] + ' This regulation is enforced by the office of the registrar and applies to all enrolled students. Repeated violations may lead to disciplinary review.',
    updated: '2026-02-14',
    number: `${t[0].toUpperCase().slice(0,3)}-${idCounter}`,
  });
});
for (let i = 0; i < 70; i++) {
  const cat = RULE_CATEGORIES[i % RULE_CATEGORIES.length];
  RULES.push({
    id: `RUL-${++idCounter}`,
    category: cat.key,
    title: `${cat.label} Sub-clause ${i + 1}`,
    summary: `Additional provision under ${cat.label.toLowerCase()} covering procedural detail #${i + 1}.`,
    body: `This clause elaborates on ${cat.label.toLowerCase()} conditions. It should be interpreted in conjunction with the primary rule set and applies uniformly to all students.`,
    updated: '2026-01-28',
    number: `${cat.key.toUpperCase().slice(0,3)}-${idCounter}`,
  });
}
export { RULES };

// ---------- SAMPLE CLAIMS ----------
export const SAMPLE_CLAIMS = [
  { q: 'Is 75% attendance mandatory?',              verdict: 'true',       conf: 98, cat: 'attendance' },
  { q: 'Can calculators be used in exams?',         verdict: 'partial',    conf: 82, cat: 'exams' },
  { q: 'Is the lab fee refundable?',                verdict: 'false',      conf: 91, cat: 'lab' },
  { q: 'Are makeup exams allowed?',                 verdict: 'mostly',     conf: 88, cat: 'exams' },
  { q: 'Can students change sections anytime?',     verdict: 'misleading', conf: 74, cat: 'general' },
  { q: 'Is hostel entry after 10 PM allowed?',      verdict: 'false',      conf: 95, cat: 'hostel' },
  { q: 'Are phones allowed in classrooms?',         verdict: 'false',      conf: 92, cat: 'conduct' },
  { q: 'Can class representatives collect money?',  verdict: 'partial',    conf: 67, cat: 'finance' },
  { q: 'Is ragging punishable by expulsion?',       verdict: 'true',       conf: 99, cat: 'discipline' },
  { q: 'Do merit scholarships need CGPA 3.75?',     verdict: 'true',       conf: 96, cat: 'scholarship' },
  { q: 'Are late entries always marked absent?',    verdict: 'mostly',     conf: 78, cat: 'attendance' },
  { q: 'Is plagiarism worth an automatic F?',       verdict: 'true',       conf: 94, cat: 'discipline' },
  { q: 'Can I borrow 10 books from the library?',   verdict: 'false',      conf: 90, cat: 'library' },
  { q: 'Is grade reappeal open for 30 days?',       verdict: 'misleading', conf: 71, cat: 'exams' },
  { q: 'Are events approved on the day-of?',        verdict: 'false',      conf: 86, cat: 'clubs' },
  { q: 'Can I bring food into class?',              verdict: 'false',      conf: 88, cat: 'conduct' },
  { q: 'Are room changes allowed anytime?',         verdict: 'misleading', conf: 69, cat: 'hostel' },
  { q: 'Are medical leaves auto-approved?',         verdict: 'partial',    conf: 65, cat: 'attendance' },
  { q: 'Is lab coat required in every lab?',        verdict: 'true',       conf: 93, cat: 'lab' },
  { q: 'Can Kuddus fine me for wrong socks?',       verdict: 'unverified', conf: 42, cat: 'general' },
];

export const SUGGESTIONS = SAMPLE_CLAIMS.slice(0, 8).map((c) => c.q);

// ---------- HISTORY ----------
export const HISTORY = Array.from({ length: 30 }, (_, i) => {
  const src = SAMPLE_CLAIMS[i % SAMPLE_CLAIMS.length];
  const d = new Date('2026-03-14T12:00:00');
  d.setHours(d.getHours() - i * 5);
  return {
    id: `FC-2026-${(3000 + i).toString()}`,
    query: src.q,
    verdict: src.verdict,
    confidence: src.conf,
    category: src.cat,
    when: d.toISOString(),
  };
});

// ---------- TRENDING ----------
export const TRENDING = [
  { id: 't1', claim: 'Kuddus can cancel exams without notice.', verdict: 'false',      conf: 96, count: 428, delta: '+38%' },
  { id: 't2', claim: '2 taka toll is official policy.',         verdict: 'false',      conf: 99, count: 371, delta: '+22%' },
  { id: 't3', claim: 'Tiffin sharing is compulsory.',           verdict: 'false',      conf: 97, count: 265, delta: '+18%' },
  { id: 't4', claim: 'CR can rearrange seat plan freely.',      verdict: 'partial',    conf: 74, count: 189, delta: '+11%' },
  { id: 't5', claim: 'Semester withdrawal is refund-free.',     verdict: 'misleading', conf: 68, count: 152, delta: '+9%'  },
  { id: 't6', claim: 'Attendance below 75% blocks exam.',       verdict: 'true',       conf: 98, count: 143, delta: '+6%'  },
  { id: 't7', claim: 'Improvement exam allowed for 3 courses.', verdict: 'false',      conf: 88, count: 117, delta: '+4%'  },
];

// ---------- EVIDENCE / SOURCES ----------
export const EVIDENCE_KINDS = {
  notice:    { label: 'University Notice',       icon: '📢', reliability: 'high' },
  circular:  { label: 'Department Circular',     icon: '📄', reliability: 'high' },
  teacher:   { label: 'Teacher Statement',       icon: '👨‍🏫', reliability: 'medium' },
  handbook:  { label: 'Student Handbook',        icon: '📘', reliability: 'high' },
  calendar:  { label: 'Academic Calendar',       icon: '📅', reliability: 'high' },
  committee: { label: 'Committee Decision',      icon: '🏛️', reliability: 'high' },
  affairs:   { label: 'Student Affairs Office',  icon: '🏢', reliability: 'high' },
};

export const buildEvidence = (query, cat) => ([
  { kind: 'handbook',  title: 'Student Handbook 2026 — Section 4',        date: '2026-01-05', desc: `Direct reference to "${query}" in the handbook chapter on ${cat}.` },
  { kind: 'notice',    title: 'University Notice #UN-2026-118',           date: '2026-02-01', desc: 'Reiterated the standing policy following student queries.' },
  { kind: 'circular',  title: `${cat.toUpperCase()} Department Circular`, date: '2026-02-11', desc: 'Departmental interpretation of the standing rule.' },
  { kind: 'teacher',   title: 'Rashid Sir — Verbal Statement',            date: '2026-03-04', desc: 'Confirmed the rule during morning assembly.' },
  { kind: 'committee', title: 'Academic Committee Minutes',               date: '2026-01-22', desc: 'Committee reaffirmed the rule with no amendment proposals.' },
]);

// ---------- ANALYTICS ----------
export const SEARCH_STATS = {
  total: 1284,
  verified: 872,
  falseCount: 291,
  trueCount: 431,
  avgConfidence: 84,
  today: 42,
  weekly: 217,
  monthly: 984,
};

export const DAILY_SEARCHES = [
  { day: 'Mon', count: 42 }, { day: 'Tue', count: 38 }, { day: 'Wed', count: 51 },
  { day: 'Thu', count: 45 }, { day: 'Fri', count: 62 }, { day: 'Sat', count: 28 }, { day: 'Sun', count: 22 },
];

export const CATEGORY_DIST = RULE_CATEGORIES.map((c) => ({
  name: c.label,
  value: HISTORY.filter((h) => h.category === c.key).length + Math.floor(Math.random() * 6) + 1,
  color: c.color,
}));

// ---------- FACT-CHECK RESULT BUILDER ----------
export function buildResult(query) {
  const match = SAMPLE_CLAIMS.find((s) => s.q.toLowerCase() === query.toLowerCase())
    ?? SAMPLE_CLAIMS[Math.floor(Math.random() * SAMPLE_CLAIMS.length)];
  const cat = findCategory(match.cat);
  const relatedRules = RULES.filter((r) => r.category === match.cat).slice(0, 4);
  const verdict = findVerdict(match.verdict);

  return {
    id: `FC-2026-${Math.floor(3100 + Math.random() * 500)}`,
    query,
    verdict: match.verdict,
    confidence: match.conf,
    category: cat.key,
    summary: `${verdict.label}: this claim aligns ${match.conf}% with the official rulebook under ${cat.label}.`,
    detailed: `Our semantic engine cross-referenced "${query}" against ${relatedRules.length} rules in the ${cat.label} category and 4 supplementary sources. The overall verdict is ${verdict.label} with a confidence of ${match.conf}%. The strongest supporting reference is the student handbook, followed by recent departmental circulars.`,
    reasoning: [
      'Query embedded and matched against the rulebook vector index.',
      'Top-5 rules retrieved with cosine similarity above 0.78.',
      'Cross-checked against departmental circulars and committee minutes.',
      'Confidence weighted by source reliability and recency.',
    ],
    recommendations: [
      'Read the linked handbook section for the exact wording.',
      'Confirm with your class teacher for edge cases.',
      'Report contradicting notices via Mission 1.',
    ],
    evidence: buildEvidence(query, cat.label),
    related: relatedRules,
    suggested: SAMPLE_CLAIMS
      .filter((s) => s.cat === match.cat && s.q !== match.q)
      .slice(0, 4)
      .map((s) => s.q),
  };
}
