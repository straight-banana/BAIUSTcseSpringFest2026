// Mock data for Mission 2 — Anti-Camouflage Seat Planner
// Frontend-only. Deterministic + realistic. Backend integration lands later.

const FIRST = [
  'Abdus', 'Sadia', 'Ishtiak', 'Hrithik', 'Farhan', 'Nusrat', 'Rafiq', 'Tanvir',
  'Mahmuda', 'Sabbir', 'Rifat', 'Anika', 'Nabila', 'Rashed', 'Jubayer', 'Fahim',
  'Sumaiya', 'Tahmid', 'Zarif', 'Meherun', 'Sadman', 'Rownak', 'Lamia', 'Arif',
  'Tasnim', 'Rakib', 'Nazia', 'Nafis', 'Sanjida', 'Mahin', 'Kuddus', 'Rashid',
  'Sabiha', 'Imran', 'Tuba', 'Ovi', 'Nayeem', 'Dipa', 'Efaz', 'Nuha',
];
const LAST = [
  'Rahman', 'Islam', 'Ahmed', 'Hossain', 'Chowdhury', 'Alam', 'Khan', 'Uddin',
  'Bhowmik', 'Rashid', 'Karim', 'Haque', 'Sarker', 'Siddique', 'Molla', 'Mia',
];

const seed = (i) => (i * 9301 + 49297) % 233280;
const rand = (i, min, max) => min + (seed(i) % (max - min + 1));

function makeStudent(i) {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 3) % LAST.length];
  const height = 140 + rand(i, 0, 55); // 140–195 cm
  const genders = ['Male', 'Female'];
  const gender = genders[i % 2];
  const visionRoll = seed(i + 7) % 100;
  const hearingRoll = seed(i + 13) % 100;
  const vision = visionRoll < 8 ? 'Severe' : visionRoll < 20 ? 'Mild' : 'None';
  const hearing = hearingRoll < 6 ? 'Severe' : hearingRoll < 18 ? 'Mild' : 'None';
  const notes =
    vision !== 'None' && hearing !== 'None'
      ? 'Requires front-row seat, close to podium.'
      : vision !== 'None'
        ? 'Vision priority — seat within 2 rows of board.'
        : hearing !== 'None'
          ? 'Hearing priority — avoid rear rows.'
          : height > 185
            ? 'Tall student — should sit near the back to avoid blocking view.'
            : '';
  return {
    id: `S-${String(100 + i).padStart(4, '0')}`,
    name: `${first} ${last}`,
    roll: `2201${String(10 + i).padStart(2, '0')}`,
    height,
    gender,
    vision,
    hearing,
    notes,
  };
}

export const STUDENTS = Array.from({ length: 34 }, (_, i) => makeStudent(i));

export const CLASSROOM_SIZES = [
  { id: '5x6', rows: 5, cols: 6, label: '5 × 6 · 30 seats' },
  { id: '6x6', rows: 6, cols: 6, label: '6 × 6 · 36 seats' },
  { id: '7x8', rows: 7, cols: 8, label: '7 × 8 · 56 seats' },
];

export const CONSTRAINT_TYPES = [
  { id: 'vision',  label: 'Vision Priority',    tone: 'brand',   desc: 'Vision-impaired students seated near the board.' },
  { id: 'hearing', label: 'Hearing Priority',   tone: 'warning', desc: 'Hearing-impaired students seated within earshot.' },
  { id: 'reserved',label: 'Reserved Seat',      tone: 'neutral', desc: 'Seat locked by teacher — cannot be swapped.' },
  { id: 'front',   label: 'Front Row Required', tone: 'success', desc: 'Student must sit in row 1.' },
  { id: 'los',     label: 'Teacher Visibility', tone: 'danger',  desc: 'Must remain in clear line-of-sight of podium.' },
];

export const SUMMARY = {
  totalStudents: STUDENTS.length,
  capacity: 56,
  emptySeats: 22,
  generatedPlans: 8,
  visionPriority: STUDENTS.filter((s) => s.vision !== 'None').length,
  hearingPriority: STUDENTS.filter((s) => s.hearing !== 'None').length,
  reserved: 3,
  frontRow: 5,
};

// Height distribution buckets
export const HEIGHT_BUCKETS = [
  { range: '140-149', count: STUDENTS.filter((s) => s.height < 150).length },
  { range: '150-159', count: STUDENTS.filter((s) => s.height >= 150 && s.height < 160).length },
  { range: '160-169', count: STUDENTS.filter((s) => s.height >= 160 && s.height < 170).length },
  { range: '170-179', count: STUDENTS.filter((s) => s.height >= 170 && s.height < 180).length },
  { range: '180-189', count: STUDENTS.filter((s) => s.height >= 180 && s.height < 190).length },
  { range: '190+',    count: STUDENTS.filter((s) => s.height >= 190).length },
];

export const CONSTRAINT_DISTRIBUTION = [
  { name: 'Vision Priority',  value: SUMMARY.visionPriority, color: '#4285F4' },
  { name: 'Hearing Priority', value: SUMMARY.hearingPriority, color: '#FBBC04' },
  { name: 'Reserved',         value: SUMMARY.reserved,       color: '#9AA0A6' },
  { name: 'Front Row',        value: SUMMARY.frontRow,       color: '#0F9D58' },
  { name: 'Standard',         value: STUDENTS.length - SUMMARY.visionPriority - SUMMARY.hearingPriority, color: '#E8EAED' },
];

export const UTILIZATION_TREND = [
  { week: 'W1', utilization: 62 },
  { week: 'W2', utilization: 68 },
  { week: 'W3', utilization: 74 },
  { week: 'W4', utilization: 71 },
  { week: 'W5', utilization: 79 },
  { week: 'W6', utilization: 83 },
  { week: 'W7', utilization: 88 },
];

export const FRONT_ROW_ALLOCATION = [
  { row: 'Row 1', tall: 0, medium: 2, short: 4 },
  { row: 'Row 2', tall: 1, medium: 3, short: 2 },
  { row: 'Row 3', tall: 2, medium: 4, short: 1 },
  { row: 'Row 4', tall: 3, medium: 3, short: 0 },
  { row: 'Row 5', tall: 4, medium: 2, short: 0 },
  { row: 'Row 6', tall: 5, medium: 1, short: 0 },
];

// Build a mock generated seating plan for a rows×cols grid.
export function buildSeatingPlan(rows, cols, students = STUDENTS) {
  // Simple deterministic fill: sort by height ascending so short/priority in front.
  const sorted = [...students].sort((a, b) => {
    const aP = a.vision !== 'None' || a.hearing !== 'None' ? -1 : 0;
    const bP = b.vision !== 'None' || b.hearing !== 'None' ? -1 : 0;
    if (aP !== bP) return aP - bP;
    return a.height - b.height;
  });
  const seats = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const student = sorted[idx] || null;
      const isAisle = cols >= 6 && c === Math.floor(cols / 2) - 1 ? false : false; // aisle rendered separately
      seats.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        label: `${String.fromCharCode(65 + r)}${c + 1}`,
        student,
        constraints: student
          ? [
              student.vision !== 'None' && 'vision',
              student.hearing !== 'None' && 'hearing',
              r === 0 && (student.vision !== 'None' || student.hearing !== 'None') && 'front',
            ].filter(Boolean)
          : [],
        reserved: false,
      });
      if (student) idx += 1;
    }
  }
  return seats;
}

export const HIGHLIGHTED_STUDENT_ID = STUDENTS[6].id;
