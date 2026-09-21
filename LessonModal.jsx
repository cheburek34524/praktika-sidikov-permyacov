const { useState } = React;

function LessonModal({ lesson, subjects, teachers, groups, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(lesson);

  const subject = subjects.find(s => s.id === form.subjectId);
  const teacherOptions = subject
    ? subject.teacherIds.map(id => teachers.find(t => t.id === id)).filter(Boolean)
    : teachers;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-bg" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <h3>{lesson.id ? "Редактирование занятия" : "Новое занятие"}</h3>

        <div className="row">
          <label>Неделя</label>
          <select value={form.week} onChange={e => set("week", +e.target.value)}>
            <option value={1}>1-я неделя</option>
            <option value={2}>2-я неделя</option>
          </select>
        </div>

        <div className="row">
          <label>День</label>
          <select value={form.day} onChange={e => set("day", +e.target.value)}>
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>

        <div className="row">
          <label>Пара</label>
          <select value={form.slot} onChange={e => set("slot", +e.target.value)}>
            {SLOTS.map((s, i) => <option key={i} value={i}>{s}</option>)}
          </select>
        </div>

        <div className="row">
          <label>Дисциплина</label>
          <select value={form.subjectId} onChange={e => {
            const sub = subjects.find(s => s.id === e.target.value);
            set("subjectId", e.target.value);
            if (sub && sub.teacherIds.length) set("teacherId", sub.teacherIds[0]);
          }}>
            <option value="">— выберите —</option>
            {subjects.map(s => {
              const g = groups.find(x => x.id === s.groupId);
              return (
                <option key={s.id} value={s.id}>
                  {s.name} ({g?.name || "?"})
                </option>
              );
            })}
          </select>
        </div>

        <div className="row">
          <label>Преподаватель</label>
          <select value={form.teacherId} onChange={e => set("teacherId", e.target.value)}>
            <option value="">— выберите —</option>
            {teacherOptions.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
          </select>
        </div>

        <div className="row">
          <label>Аудитория</label>
          <input value={form.room} placeholder="например, 305"
                 onChange={e => set("room", e.target.value)} />
        </div>

        <div className="row">
          <label>Тип занятия</label>
          <select value={form.type} onChange={e => set("type", e.target.value)}>
            {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div className="actions">
          {lesson.id && (
            <button className="danger" onClick={() => onDelete(lesson.id)}>Удалить</button>
          )}
          <button onClick={onClose}>Отмена</button>
          <button className="primary" onClick={() => {
            if (!form.subjectId || !form.teacherId) {
              alert("Выберите дисциплину и преподавателя");
              return;
            }
            onSave(form);
          }}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}

window.LessonModal = LessonModal;