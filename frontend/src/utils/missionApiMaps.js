export const COMPLAINT_CATEGORY_OPTIONS = [
  { value: 'TIFFIN_THEFT', label: 'Tiffin Theft', tone: 'warning' },
  { value: 'BRIBE', label: 'Bribe', tone: 'danger' },
  { value: 'LARGE_SYLLABUS', label: 'Large Syllabus', tone: 'warning' },
  { value: 'BULLYING', label: 'Bullying', tone: 'danger' },
  { value: 'OTHER', label: 'Other', tone: 'neutral' },
];

export const COMPLAINT_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', tone: 'neutral' },
  { value: 'UNDER_REVIEW', label: 'Under Review', tone: 'warning' },
  { value: 'INVESTIGATING', label: 'Investigating', tone: 'brand' },
  { value: 'RESOLVED', label: 'Resolved', tone: 'success' },
  { value: 'REJECTED', label: 'Rejected', tone: 'danger' },
];

function normalizeValue(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function normalizeComplaintCategory(value) {
  const key = normalizeValue(value);
  const match = COMPLAINT_CATEGORY_OPTIONS.find((option) => normalizeValue(option.value) === key);
  return match || COMPLAINT_CATEGORY_OPTIONS[4];
}

export function normalizeComplaintStatus(value) {
  const key = normalizeValue(value);
  const match = COMPLAINT_STATUS_OPTIONS.find((option) => normalizeValue(option.value) === key);
  return match || COMPLAINT_STATUS_OPTIONS[0];
}

export function mapComplaintFromApi(item) {
  if (!item) return null;
  const category = normalizeComplaintCategory(item.category);
  const status = normalizeComplaintStatus(item.status);
  return {
    id: item.referenceCode || item.id,
    referenceId: item.referenceCode || item.id,
    title: item.description?.slice(0, 60) || 'Complaint',
    subject: item.description?.slice(0, 60) || 'Complaint',
    description: item.description || '',
    category: category.value,
    categoryLabel: category.label,
    status: status.value,
    statusLabel: status.label,
    course: item.course || '—',
    courseCode: item.courseCode || '—',
    teacher: item.teacher || '—',
    classroom: item.classroom || '—',
    incidentDate: item.incidentDate || new Date(item.createdAt).toISOString().slice(0, 10),
    incidentTime: item.incidentTime || '00:00',
    submittedAt: item.createdAt || new Date().toISOString(),
    lastUpdated: item.updatedAt || item.createdAt || new Date().toISOString(),
    strikeWeight: item.warningCount || 0,
    evidenceCount: item.imageUrl ? 1 : 0,
    hasEvidence: Boolean(item.imageUrl),
    anonymous: item.anonymous !== false,
    imageUrl: item.imageUrl || null,
    offender: item.offender || null,
  };
}

export function normalizeTrackerStatus(value) {
  const key = normalizeValue(value);
  if (['completed', 'success'].includes(key)) return 'completed';
  if (['pending'].includes(key)) return 'pending';
  if (['cancelled'].includes(key)) return 'cancelled';
  if (['refunded'].includes(key)) return 'refunded';
  return 'completed';
}

export function mapTrackerEntryFromApi(item) {
  if (!item) return null;
  const type = normalizeValue(item.type);
  const category = type.includes('food') ? 'tiffin' : type === 'bribe_payment' ? 'emergency' : 'stationery';
  return {
    id: item.id,
    description: item.description || 'Transaction',
    category,
    type: 'expense',
    amount: Number(item.amount || 0),
    addedBy: item.user?.name || 'System',
    method: normalizeValue(item.paymentMethod).toLowerCase(),
    status: normalizeTrackerStatus(item.status),
    date: item.date || item.createdAt,
    remarks: item.description || '',
    rawType: item.type,
  };
}

export function mapSeatPlanFromApi(plan) {
  if (!plan) return null;
  const seats = (plan.seats || []).map((seat) => ({
    id: seat.id,
    row: Number(seat.row),
    col: Number(seat.col),
    label: `${String.fromCharCode(65 + Number(seat.row))}${Number(seat.col) + 1}`,
    student: {
      id: seat.id,
      name: seat.name,
      height: Number(seat.height || 0),
      rollNumber: seat.rollNumber,
      hasVisionProblem: Boolean(seat.hasVisionProblem),
      hasHearingProblem: Boolean(seat.hasHearingProblem),
      notes: seat.notes,
      isKuddus: Boolean(seat.isKuddus),
    },
    constraints: [],
    isKuddus: Boolean(seat.isKuddus),
    rollNumber: seat.rollNumber,
    hasVisionProblem: Boolean(seat.hasVisionProblem),
    hasHearingProblem: Boolean(seat.hasHearingProblem),
    notes: seat.notes,
  }));
  return {
    ...plan,
    seats,
    summary: {
      totalStudents: seats.length,
      capacity: Number(plan.gridRows || 0) * Number(plan.gridCols || 0),
      emptySeats: Math.max(0, Number(plan.gridRows || 0) * Number(plan.gridCols || 0) - seats.length),
      generatedPlans: 1,
    },
  };
}

export function mapSosAlertFromApi(item) {
  if (!item) return null;
  const location = normalizeValue(item.location);
  const type = normalizeValue(item.type);
  const severity = normalizeValue(item.severity);
  const status = normalizeValue(item.status);
  return {
    id: item.id,
    location: location || 'other',
    type: type || 'other',
    severity: severity || 'medium',
    status: status || 'active',
    description: item.message || 'Emergency alert',
    time: item.createdAt,
    student: item.reportedBy?.name || 'Student',
    captain: item.claimedBy?.name || '—',
    raw: item,
  };
}

export function mapSosLocation(value) {
  const map = {
    classroom: 'CLASSROOM',
    library: 'LIBRARY',
    playground: 'PLAYGROUND',
    corridor: 'CORRIDOR',
    canteen: 'CANTEEN',
    office: 'OFFICE',
    restroom: 'RESTROOM',
    other: 'OTHER',
  };
  return map[normalizeValue(value)] || 'OTHER';
}

export function mapSosSeverity(value) {
  const map = {
    low: 'LOW',
    medium: 'MEDIUM',
    high: 'HIGH',
    critical: 'CRITICAL',
  };
  return map[normalizeValue(value)] || 'MEDIUM';
}

export function mapSosType(value) {
  const map = {
    injury: 'MEDICAL',
    bullying: 'BULLYING',
    theft: 'THEFT',
    fire: 'FIRE',
    other: 'OTHER',
  };
  return map[normalizeValue(value)] || 'OTHER';
}

export function sosStatusBadge(value) {
  const key = normalizeValue(value);
  if (['active', 'pending'].includes(key)) return { label: 'Pending', tone: 'warning' };
  if (['claimed', 'responding', 'received'].includes(key)) return { label: 'Claimed', tone: 'brand' };
  if (['resolved', 'closed'].includes(key)) return { label: 'Resolved', tone: 'success' };
  if (['cancelled', 'cancel'].includes(key)) return { label: 'Cancelled', tone: 'neutral' };
  return { label: String(value || '').toUpperCase(), tone: 'neutral' };
}

export function sosSeverityBadge(value) {
  const key = normalizeValue(value);
  if (key === 'critical') return { label: 'Critical', tone: 'danger' };
  if (key === 'high') return { label: 'High', tone: 'warning' };
  if (key === 'medium') return { label: 'Medium', tone: 'warning' };
  if (key === 'low') return { label: 'Low', tone: 'success' };
  return { label: String(value || '').replace(/_/g, ' '), tone: 'neutral' };
}

// Mission 4 helpers (fallbacks for categories / payment methods and currency formatting)
export const MISSION4_CATEGORIES = [
  { key: 'class_fund', label: 'Class Fund', type: 'income', icon: '🏫' },
  { key: 'donation', label: 'Donation', type: 'income', icon: '🎁' },
  { key: 'event_collection', label: 'Event Collection', type: 'income', icon: '🎉' },
  { key: 'student_contrib', label: 'Student Contrib.', type: 'income', icon: '👥' },
  { key: 'tiffin', label: 'Tiffin', type: 'expense', icon: '🥪' },
  { key: 'stationery', label: 'Stationery', type: 'expense', icon: '✏️' },
  { key: 'printing', label: 'Printing', type: 'expense', icon: '🖨️' },
  { key: 'decoration', label: 'Decoration', type: 'expense', icon: '🎈' },
  { key: 'event_expense', label: 'Event Expense', type: 'expense', icon: '🎪' },
  { key: 'emergency', label: 'Emergency Fund', type: 'expense', icon: '🚨' },
];

export const MISSION4_PAYMENT_METHODS = [
  { key: 'cash', label: 'Cash', icon: '💵' },
  { key: 'bkash', label: 'Bkash', icon: '📱' },
  { key: 'nagad', label: 'Nagad', icon: '📲' },
  { key: 'bank', label: 'Bank', icon: '🏦' },
];

export function formatBDT(n) {
  const v = Number(n || 0);
  return '৳' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(v));
}

export const AUDIT_TRAIL = [
  { when: '2026-03-14 09:12', who: 'Kuddus (Captain)', action: 'Created transaction' },
  { when: '2026-03-14 09:14', who: 'Rashid Sir',       action: 'Reviewed transaction' },
  { when: '2026-03-14 10:02', who: 'Sadia (V-Captain)',action: 'Marked as completed' },
];

export const MISSION5_TIPS = [
  'Stay calm and take deep breaths.',
  'Move to a safe, visible area if possible.',
  'If injured, try to slow bleeding and call for help.',
  'Notify a nearby teacher or captain immediately.',
  'Do not engage with an aggressor if it puts you at risk.'
];

export const MISSION5_LOCATIONS = [
  { key: 'classroom', label: 'Classroom', icon: '🏫' },
  { key: 'library', label: 'Library', icon: '📚' },
  { key: 'playground', label: 'Playground', icon: '🏟️' },
  { key: 'corridor', label: 'Corridor', icon: '↔️' },
  { key: 'canteen', label: 'Canteen', icon: '🍽️' },
  { key: 'office', label: 'Office', icon: '🏢' },
  { key: 'restroom', label: 'Restroom', icon: '🚻' },
  { key: 'other', label: 'Other', icon: '📍' },
];

export const MISSION5_TYPES = [
  { key: 'injury', label: 'Medical / Injury', icon: '🤕' },
  { key: 'bullying', label: 'Bullying', icon: '😡' },
  { key: 'theft', label: 'Theft', icon: '👜' },
  { key: 'fire', label: 'Fire', icon: '🔥' },
  { key: 'other', label: 'Other', icon: '❓' },
];

export const MISSION5_SEVERITIES = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
  { key: 'critical', label: 'Critical' },
];
