// Passes the synchronous AI response from SyllabusInput -> AISummary/StudyPlan
// without a "processing" route. In-memory first (fast), sessionStorage fallback
// (survives a hard refresh). Not durable storage — history/calendar/stats must
// come from your own backend.
const KEY = 'akp:lastAiRun';
let mem = null;

export function setLastRun(run) {
  mem = run;
  try { sessionStorage.setItem(KEY, JSON.stringify(run)); } catch {}
}

export function getLastRun() {
  if (mem) return mem;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) { mem = JSON.parse(raw); return mem; }
  } catch {}
  return null;
}

export function clearLastRun() {
  mem = null;
  try { sessionStorage.removeItem(KEY); } catch {}
}
