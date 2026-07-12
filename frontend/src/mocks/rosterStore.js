// In-memory roster of students used by the Captain Engine "Assign Captain" screen.
// One captain per (class, section). Seeded with mock data so teachers can browse.

const FIRST = ['Abdus','Sadia','Ishtiak','Hrithik','Rafiq','Nafisa','Tanvir','Mahira','Sabbir','Fariha','Rashed','Nadia','Junayed','Anika','Rehan','Mim','Shafin','Rumi','Kabir','Tasnim','Arif','Meher','Zaid','Rifat'];
const LAST  = ['Salam','Rashid','Ahmed','Bhowmik','Chowdhury','Khan','Islam','Hasan','Karim','Sultana','Reza','Haque','Uddin','Sarker','Alam','Nabi','Alvi','Roy','Miah','Rahman'];
const CLASSES  = ['6','7','8','9','10'];
const SECTIONS = ['A','B','C','D'];

function seed() {
  const list = [];
  let idx = 0;
  for (const cls of CLASSES) {
    for (const sec of SECTIONS) {
      const size = 8 + ((idx * 3) % 5); // 8..12 per section
      for (let i = 0; i < size; i++) {
        const first = FIRST[(idx + i) % FIRST.length];
        const last  = LAST[(idx * 2 + i) % LAST.length];
        const roll  = `${cls}${sec}-${String(i + 1).padStart(3, '0')}`;
        list.push({
          id: roll,
          name: `${first} ${last}`,
          roll,
          className: cls,
          section: sec,
          isCaptain: false,
        });
      }
      idx++;
    }
  }
  // Pre-assign a captain for a few sections so the UI has state to show
  const preset = ['9C', '10A', '7B'];
  preset.forEach((key) => {
    const target = list.find((s) => `${s.className}${s.section}` === key);
    if (target) target.isCaptain = true;
  });
  return list;
}

let version = 0;
const STUDENTS = seed();
const listeners = new Set();
const notify = () => { version++; listeners.forEach((fn) => fn()); };

export function getStudents() { return STUDENTS; }
export function getVersion() { return version; }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Toggle a student's captain status. Enforces one captain per (class, section):
 * turning a student ON demotes any prior captain in the same section.
 */
export function setCaptain(studentId, makeCaptain) {
  const target = STUDENTS.find((s) => s.id === studentId);
  if (!target) return;
  if (makeCaptain) {
    STUDENTS.forEach((s) => {
      if (s.className === target.className && s.section === target.section) {
        s.isCaptain = s.id === studentId;
      }
    });
  } else {
    target.isCaptain = false;
  }
  notify();
}

export const CLASS_OPTIONS = CLASSES;
export const SECTION_OPTIONS = SECTIONS;
