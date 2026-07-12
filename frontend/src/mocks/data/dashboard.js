export const stats = [
  { key: 'students', label: 'Total Students', value: 1284, trend: 3.2, hint: 'Active this term' },
  { key: 'complaints', label: 'Active Complaints', value: 27, trend: -8.1, hint: 'Under review' },
  { key: 'sos', label: 'Pending SOS', value: 3, trend: 12.0, hint: 'Awaiting response' },
  { key: 'seats', label: 'Seat Plans', value: 42, trend: 5.4, hint: 'Generated this month' },
  { key: 'ledger', label: 'Ledger Entries', value: 613, trend: 1.1, hint: 'All-time' },
  { key: 'facts', label: 'Fact Checks', value: 189, trend: 22.5, hint: 'Last 30 days' },
];

export const activity = [
  { id: 1, when: '2m ago', who: 'Anonymous', what: 'Filed a complaint under Tiffin Theft' },
  { id: 2, when: '18m ago', who: 'Captain Rana', what: 'Resolved SOS in Corridor' },
  { id: 3, when: '1h ago', who: 'Sir Rashid', what: 'Approved shortlist of 6 candidates' },
  { id: 4, when: '3h ago', who: 'System', what: 'Generated seat plan for Class 9C' },
  { id: 5, when: 'Yesterday', who: 'Anonymous', what: 'Added 2 Taka to the ledger' },
];

export const tasks = [
  { id: 1, label: 'Review Mission 1 anonymity pipeline', due: 'Today' },
  { id: 2, label: 'Approve seat plan overrides', due: 'Tomorrow' },
  { id: 3, label: 'Publish weekly transparency report', due: 'Fri' },
];

export const notifications = [
  { id: 1, title: 'New SOS Alert', body: 'Playground — 12s ago', tone: 'danger' },
  { id: 2, title: 'Trust Score Drop', body: 'Captain Rana −4 this week', tone: 'warning' },
  { id: 3, title: 'Vote Closes Soon', body: '2 hours remaining', tone: 'brand' },
];

export const chartSeries = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  complaints: Math.round(6 + Math.sin(i / 2) * 4 + Math.random() * 3),
  sos: Math.round(2 + Math.cos(i / 3) * 2 + Math.random() * 1.5),
}));
