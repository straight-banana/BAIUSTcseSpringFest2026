import { akpFetch } from './aiApi.js';

// POST /api/v1/syllabus/summarize  — synchronous, returns full summary.
// Contract note: syllabus_text must be at least 20 characters.
export async function summarizeSyllabus(syllabusText, { signal } = {}) {
  const text = String(syllabusText ?? '').trim();
  return akpFetch('/api/v1/syllabus/summarize', {
    method: 'POST',
    body: { syllabus_text: text },
    signal,
  });
}

// POST /api/v1/syllabus/study-plan — synchronous. Sends the same syllabus text;
// pass extra planning knobs the caller wants forwarded (days, hours_per_day, …).
export async function generateStudyPlan(syllabusText, extras = {}, { signal } = {}) {
  const text = String(syllabusText ?? '').trim();
  return akpFetch('/api/v1/syllabus/study-plan', {
    method: 'POST',
    body: { syllabus_text: text, ...extras },
    signal,
  });
}
