const { useState } = React;

function LessonCell({
  week, day, slot, lessons, subjects, teachers, groups,
  conflicts, onDropLesson, onOpenLesson
}) {
  const [over, setOver] = useState(false);

  const cellLessons = lessons.filter(l => l.week === week && l.day === day && l.slot === slot);

  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const id = e.dataTransfer.getData("text/lesson-id");
    if (id) onDropLesson(id, week, day, slot);
  };

  return (
    <td
      className={`cell ${over ? "drag-over" : ""}`}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onDoubleClick={() => onOpenLesson({ week, day, slot })}
    >
      {cellLessons.map(l => {
        const sub = subjects.find(s => s.id === l.subjectId);
        const t = teachers.find(x => x.id === l.teacherId);
        const g = sub ? groups.find(x => x.id === sub.groupId) : null;
        const isConf = conflicts.has(l.id);

        return (
          <div
            key={l.id}
            className={`lesson ${l.type} ${isConf ? "conflict" : ""}`}
            draggable
            onDragStart={e => {
              e.dataTransfer.setData("text/lesson-id", l.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDoubleClick={e => { e.stopPropagation(); onOpenLesson(l); }}
            title={isConf ? "Конфликт!" : ""}
          >
            <b>{sub?.name || "—"}</b>
            <small>{g?.name || ""} · {t?.fullName?.split(" ")[0] || ""}</small>
            <small>ауд. {l.room || "—"}</small>
          </div>
        );
      })}
    </td>
  );
}

window.LessonCell = LessonCell;