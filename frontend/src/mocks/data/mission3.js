// Mock data for Mission 3 — AI Syllabus Negotiator
// All content is synthesized. No AI is actually called.

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', tone: 'success' },
  { value: 'medium', label: 'Medium', tone: 'warning' },
  { value: 'hard', label: 'Hard', tone: 'danger' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', tone: 'neutral' },
  { value: 'normal', label: 'Normal', tone: 'brand' },
  { value: 'high', label: 'High', tone: 'warning' },
  { value: 'critical', label: 'Critical', tone: 'danger' },
];

export const findDifficulty = (v) => DIFFICULTIES.find((d) => d.value === v) || DIFFICULTIES[1];
export const findPriority = (v) => PRIORITIES.find((p) => p.value === v) || PRIORITIES[1];

export const EXAMPLE_SYLLABUS = `CSE 2201 — Data Structures & Algorithms (Spring 2026)

Week 1: Introduction, Complexity Analysis (Big-O, Omega, Theta)
Week 2: Arrays, Strings, Recursion, Master Theorem
Week 3: Linked Lists — Singly, Doubly, Circular
Week 4: Stacks, Queues, Deques, Priority Queues
Week 5: Trees — Binary Trees, BST, AVL, Red-Black
Week 6: Heaps, Heapsort, k-way merging
Week 7: Hash Tables, Collision Resolution, Bloom Filters
Week 8: Midterm review — includes department barcode reference index (non-examinable)
Week 9: Graphs — BFS, DFS, Topological Sort
Week 10: Shortest Paths — Dijkstra, Bellman-Ford, Floyd-Warshall
Week 11: MSTs — Kruskal, Prim, Union-Find
Week 12: Dynamic Programming — LIS, LCS, Knapsack
Week 13: Greedy Algorithms, Huffman Coding
Week 14: Advanced — Segment Trees, Fenwick, Persistent DS
Appendix A: Author biography, publication timeline (non-examinable)
Appendix B: Index & barcode metadata (non-examinable)`;

const now = new Date();
const daysAgo = (n) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const RECENT_SESSIONS = [
  { id: 'SYL-2041', title: 'CSE 2201 — DSA Spring 2026', course: 'CSE 2201', createdAt: daysAgo(0), lastOpenedAt: daysAgo(0), status: 'ready', topics: 24, hours: 46 },
  { id: 'SYL-2038', title: 'PHY 1103 — Physics I', course: 'PHY 1103', createdAt: daysAgo(2), lastOpenedAt: daysAgo(1), status: 'ready', topics: 18, hours: 32 },
  { id: 'SYL-2029', title: 'MATH 1101 — Calculus & Analytic Geometry', course: 'MATH 1101', createdAt: daysAgo(5), lastOpenedAt: daysAgo(3), status: 'archived', topics: 21, hours: 40 },
  { id: 'SYL-2015', title: 'HUM 1201 — English Composition', course: 'HUM 1201', createdAt: daysAgo(11), lastOpenedAt: daysAgo(7), status: 'ready', topics: 12, hours: 18 },
  { id: 'SYL-2004', title: 'CHEM 1101 — Chemistry Fundamentals', course: 'CHEM 1101', createdAt: daysAgo(20), lastOpenedAt: daysAgo(14), status: 'archived', topics: 16, hours: 28 },
  { id: 'SYL-1998', title: 'CSE 1101 — Intro to Programming', course: 'CSE 1101', createdAt: daysAgo(32), lastOpenedAt: daysAgo(24), status: 'archived', topics: 14, hours: 22 },
];

export const USAGE_STATS = {
  sessionsThisWeek: 6,
  tokensSaved: 148_320,
  topicsFiltered: 41,
  avgSummaryTime: 12.4,
};

export const PROCESSING_STEPS = [
  { key: 'read', label: 'Reading syllabus', detail: 'Parsing structure and weekly outline' },
  { key: 'identify', label: 'Identifying topics', detail: 'Extracting units, subtopics and keywords' },
  { key: 'filter', label: 'Removing unnecessary content', detail: 'Dropping non-examinable appendices' },
  { key: 'summarize', label: 'Generating summary', detail: 'Compressing to exam-relevant bullets' },
  { key: 'schedule', label: 'Building study schedule', detail: 'Distributing across available days' },
];

export const MOCK_SUMMARY = {
  courseTitle: 'CSE 2201 — Data Structures & Algorithms',
  overview:
    'A 14-week course covering fundamental and advanced data structures with an algorithmic emphasis. The curriculum builds from complexity analysis through linear structures, hierarchical trees, hashing, graph algorithms, dynamic programming and specialized index structures.',
  importantTopics: [
    'Complexity analysis (Big-O / Master Theorem)',
    'Linked lists, stacks & queues',
    'Binary search trees & self-balancing trees',
    'Hash tables & collision handling',
    'Graph traversal & shortest paths',
    'Dynamic programming patterns',
    'Greedy algorithms',
    'Segment trees & Fenwick trees',
  ],
  removedTopics: [
    'Department barcode reference index',
    'Author biography (Appendix A)',
    'Publication timeline',
    'Index metadata (Appendix B)',
  ],
  examTopics: [
    { name: 'Trees & BSTs', probability: 92 },
    { name: 'Graph shortest paths', probability: 88 },
    { name: 'Dynamic programming', probability: 85 },
    { name: 'Hashing', probability: 78 },
    { name: 'Complexity analysis', probability: 74 },
    { name: 'Greedy algorithms', probability: 61 },
  ],
  difficulty: 'hard',
  priority: 'critical',
  estimatedHours: 46,
};

export const MOCK_TOPICS = [
  { id: 't1', name: 'Complexity Analysis', importance: 82, difficulty: 'medium', hours: 3, examProbability: 74, priority: 'high', progress: 60 },
  { id: 't2', name: 'Arrays & Recursion', importance: 68, difficulty: 'easy', hours: 2, examProbability: 55, priority: 'normal', progress: 80 },
  { id: 't3', name: 'Linked Lists', importance: 74, difficulty: 'medium', hours: 3, examProbability: 62, priority: 'high', progress: 40 },
  { id: 't4', name: 'Stacks, Queues, Deques', importance: 71, difficulty: 'easy', hours: 2.5, examProbability: 58, priority: 'normal', progress: 65 },
  { id: 't5', name: 'Binary Trees & BSTs', importance: 94, difficulty: 'hard', hours: 5, examProbability: 92, priority: 'critical', progress: 30 },
  { id: 't6', name: 'AVL & Red-Black Trees', importance: 88, difficulty: 'hard', hours: 4.5, examProbability: 81, priority: 'critical', progress: 15 },
  { id: 't7', name: 'Heaps & Heapsort', importance: 76, difficulty: 'medium', hours: 3, examProbability: 66, priority: 'high', progress: 45 },
  { id: 't8', name: 'Hash Tables', importance: 85, difficulty: 'medium', hours: 4, examProbability: 78, priority: 'high', progress: 50 },
  { id: 't9', name: 'Graph Traversal (BFS/DFS)', importance: 90, difficulty: 'medium', hours: 4, examProbability: 84, priority: 'critical', progress: 25 },
  { id: 't10', name: 'Shortest Paths', importance: 91, difficulty: 'hard', hours: 5, examProbability: 88, priority: 'critical', progress: 20 },
  { id: 't11', name: 'MSTs & Union-Find', importance: 79, difficulty: 'medium', hours: 3.5, examProbability: 70, priority: 'high', progress: 10 },
  { id: 't12', name: 'Dynamic Programming', importance: 93, difficulty: 'hard', hours: 6, examProbability: 85, priority: 'critical', progress: 12 },
  { id: 't13', name: 'Greedy Algorithms', importance: 72, difficulty: 'medium', hours: 3, examProbability: 61, priority: 'normal', progress: 20 },
  { id: 't14', name: 'Segment & Fenwick Trees', importance: 80, difficulty: 'hard', hours: 4.5, examProbability: 68, priority: 'high', progress: 5 },
];

const dayName = (offset) => {
  const d = new Date(now);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

export const STUDY_PLAN = {
  totalHours: 46,
  completedHours: 14,
  streakDays: 5,
  weeks: [
    {
      label: 'Week 1 · Foundations',
      days: [
        { day: dayName(0), sessions: [
          { id: 's1', topic: 'Complexity Analysis', hours: 1.5, difficulty: 'medium', priority: 'high', completed: true },
          { id: 's2', topic: 'Arrays & Recursion', hours: 1, difficulty: 'easy', priority: 'normal', completed: true },
        ]},
        { day: dayName(1), sessions: [
          { id: 's3', topic: 'Linked Lists', hours: 2, difficulty: 'medium', priority: 'high', completed: false },
        ]},
        { day: dayName(2), sessions: [
          { id: 's4', topic: 'Stacks & Queues', hours: 1.5, difficulty: 'easy', priority: 'normal', completed: false },
          { id: 's5', topic: 'Priority Queues', hours: 1, difficulty: 'medium', priority: 'high', completed: false },
        ]},
      ],
    },
    {
      label: 'Week 2 · Trees & Hashing',
      days: [
        { day: dayName(3), sessions: [
          { id: 's6', topic: 'Binary Trees & BSTs', hours: 2.5, difficulty: 'hard', priority: 'critical', completed: false },
        ]},
        { day: dayName(4), sessions: [
          { id: 's7', topic: 'AVL & Red-Black Trees', hours: 2, difficulty: 'hard', priority: 'critical', completed: false },
        ]},
        { day: dayName(5), sessions: [
          { id: 's8', topic: 'Hash Tables', hours: 2, difficulty: 'medium', priority: 'high', completed: false },
        ]},
      ],
    },
    {
      label: 'Week 3 · Graphs & DP',
      days: [
        { day: dayName(6), sessions: [
          { id: 's9', topic: 'BFS / DFS', hours: 2, difficulty: 'medium', priority: 'critical', completed: false },
          { id: 's10', topic: 'Shortest Paths', hours: 2, difficulty: 'hard', priority: 'critical', completed: false },
        ]},
        { day: dayName(7), sessions: [
          { id: 's11', topic: 'Dynamic Programming', hours: 3, difficulty: 'hard', priority: 'critical', completed: false },
        ]},
      ],
    },
  ],
};

export const CALENDAR_TASKS = (() => {
  // Simple map: date offset -> tasks
  const map = {};
  const push = (offset, task) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    const key = d.toISOString().slice(0, 10);
    map[key] = map[key] || [];
    map[key].push(task);
  };
  push(-4, { title: 'Complexity drills', hours: 1, done: true });
  push(-3, { title: 'Recursion practice', hours: 1.5, done: true });
  push(-2, { title: 'Arrays quiz', hours: 1, done: true });
  push(-1, { title: 'Linked list warmup', hours: 1, done: true });
  push(0, { title: 'BST fundamentals', hours: 2, done: false });
  push(0, { title: 'Complexity review', hours: 0.5, done: false });
  push(1, { title: 'AVL rotations lab', hours: 2, done: false });
  push(2, { title: 'Hash table workshop', hours: 1.5, done: false });
  push(3, { title: 'Graph traversal drills', hours: 2, done: false });
  push(5, { title: 'DP patterns', hours: 2.5, done: false });
  push(7, { title: 'Mock midterm', hours: 3, done: false });
  return map;
})();

export const STATS = {
  topicsCovered: 9,
  topicsTotal: 24,
  hoursPlanned: 46,
  hoursCompleted: 14,
  streak: 5,
  completionRate: 30,
  avgDaily: 1.8,
  weekly: [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.1 },
    { day: 'Wed', hours: 0.8 },
    { day: 'Thu', hours: 2.6 },
    { day: 'Fri', hours: 1.9 },
    { day: 'Sat', hours: 3.2 },
    { day: 'Sun', hours: 1.4 },
  ],
  distribution: [
    { name: 'Trees', value: 22, color: '#FF8F00' },
    { name: 'Graphs', value: 18, color: '#C62828' },
    { name: 'DP', value: 16, color: '#FBC02D' },
    { name: 'Hashing', value: 12, color: '#00ACC1' },
    { name: 'Sorting', value: 10, color: '#AB47BC' },
    { name: 'Other', value: 22, color: '#4285F4' },
  ],
  trend: Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`,
    planned: 2 + Math.round(Math.sin(i / 2) * 0.8 * 10) / 10,
    actual: 1.4 + Math.round(Math.cos(i / 3) * 0.7 * 10) / 10,
  })),
  radar: [
    { skill: 'Recall', A: 78 },
    { skill: 'Concepts', A: 64 },
    { skill: 'Coding', A: 82 },
    { skill: 'Analysis', A: 55 },
    { skill: 'Speed', A: 70 },
    { skill: 'Accuracy', A: 68 },
  ],
};
