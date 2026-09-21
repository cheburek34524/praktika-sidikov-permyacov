window.uid = function uid() {
  return Math.random().toString(36).slice(2, 9);
};

window.findConflicts = function findConflicts(lessons) {
  const conflicts = new Set();
  for (let i = 0; i < lessons.length; i++) {
    for (let j = i + 1; j < lessons.length; j++) {
      const a = lessons[i], b = lessons[j];
      if (a.week !== b.week || a.day !== b.day || a.slot !== b.slot) continue;

      if (a.teacherId === b.teacherId) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
      if (a.room && b.room && a.room === b.room) {
        conflicts.add(a.id);
        conflicts.add(b.id);
      }
    }
  }
  return conflicts;
};