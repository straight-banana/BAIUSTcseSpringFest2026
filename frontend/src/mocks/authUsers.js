// Mock authentication data — display-only, no real logic.
// Teachers are pre-seeded (no self-serve registration). Students register
// themselves; captains are promoted by teachers from the Captain Engine.
export const MOCK_USERS = {
  // Students
  '220101': { name: 'John Doe', roll: '220101', roles: ['student'], batch: '2022', dept: 'CSE' },
  '220001': { name: 'Jane Smith', roll: '220001', roles: ['student'], batch: '2022', dept: 'CSE' },

  // Seeded teacher / office accounts (login only; password mocked)
  T001: { name: 'Dr. Ahmed Karim',  roll: 'T001', roles: ['teacher'], subject: 'Mathematics',  staffRole: 'Teacher' },
  T002: { name: 'Ms. Nafisa Rahman', roll: 'T002', roles: ['teacher'], subject: 'English',      staffRole: 'Teacher' },
  T003: { name: 'Mr. Ishtiak Reza',  roll: 'T003', roles: ['teacher'], subject: 'Physics',      staffRole: 'Teacher' },
  T004: { name: 'Mrs. Sadia Islam',  roll: 'T004', roles: ['teacher'], subject: 'Chemistry',    staffRole: 'Teacher' },
  O001: { name: 'Office Desk',       roll: 'O001', roles: ['office'], subject: '—',            staffRole: 'Office Admin' },
};

export const VALID_ROLLS = Object.keys(MOCK_USERS);

export const ROLE_META = {
  student: {
    label: 'Student',
    description: 'Submit complaints, rate peers, and access learning tools.',
    tone: 'brand',
    path: '/student',
  },
  captain: {
    label: 'Class Captain',
    description: 'Moderate reports, run SOS console, and coordinate the class.',
    tone: 'accent',
    path: '/captain',
  },
  teacher: {
    label: 'Teacher',
    description: 'Review complaints, run captain engine, and administer elections.',
    tone: 'warning',
    path: '/teacher',
  },
  office: {
    label: 'Office',
    description: 'Oversee moderation, view analytics, and manage records.',
    tone: 'danger',
    path: '/office',
  },
};
