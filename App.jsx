const { useState, useEffect, useMemo } = React;

function App() {
  const [state, setState] = useState(loadState);
  const [week, setWeek] = useState(1);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  const conflicts = useMemo(() => findConflicts(state.lessons), [state.lessons]);

  const setGroups   = (groups)   => setState(s => ({ ...s, groups }));
  const setTeachers = (teachers) => setState(s => ({ ...s, teachers }));
  const setSubjects = (subjects) => setState(s => ({ ...s, subjects }));
  const setLessons  = (lessons)  => setState(s => ({ ...s, lessons }));

  const saveLesson = (form) => {
    setLessons(prev => {
      const exists = prev.some(l => l.id === form.id);
      return exists
        ? prev.map(l => l.id === form.id ? form : l)
        : [...prev, { ...form, id: uid() }];
    });
    setModal(null);
  };

  const deleteLesson = (id) => {
    setLessons(state.lessons.filter(l => l.id !== id));
    setModal(null);
  };

  const dropLesson = (id, week, day, slot) => {
    setLessons(state.lessons.map(l => l.id === id ? { ...l, week, day, slot } : l));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "schedule.json";
    a.click();
  };

  const resetAll = () => {
    if (confirm("Удалить все данные?")) {
      setState(defaultState);
      localStorage.removeItem(LS_KEY);
    }
  };

  const conflictList = useMemo(() => {
    const list = [];
    const byKey = {};
    state.lessons.forEach(l => {
      const keys = [`t:${l.teacherId}`, `r:${l.room}`];
      const sub = state.subjects.find(s => s.id === l.subjectId);
      if (sub) keys.push(`g:${sub.groupId}`);
      keys.forEach(k => {
        const full = `${l.week}|${l.day}|${l.slot}|${k}`;
        (byKey[full] = byKey[full] || []).push(l);
      });
    });
    Object.values(byKey).forEach(arr => {
      if (arr.length > 1) list.push(arr);
    });
    return list;
  }, [state.lessons, state.subjects]);

  return (
    <div className="app">
      <aside className="sidebar no-print">
        <h1> Конструктор расписания</h1>
        <GroupsPanel groups={state.groups} subjects={state.subjects} onChange={setGroups} />
        <TeachersPanel teachers={state.teachers} subjects={state.subjects} onChange={setTeachers} />
        <SubjectsPanel subjects={state.subjects} groups={state.groups}
                       teachers={state.teachers} onChange={setSubjects} />
      </aside>

      <main className="main">
        <div className="print-title">Расписание занятий · {week}-я неделя</div>

        <div className="toolbar no-print">
          <div className="weeks">
            <button className={week === 1 ? "active" : ""} onClick={() => setWeek(1)}>1-я неделя</button>
            <button className={week === 2 ? "active" : ""} onClick={() => setWeek(2)}>2-я неделя</button>
          </div>
          <span className="badge">занятий: {state.lessons.filter(l => l.week === week).length}</span>
          <span className="badge" style={{
            background: conflicts.size ? "#ffe5e5" : "#e8f7ee",
            color: conflicts.size ? "#c0392b" : "#16a085"
          }}>
            конфликтов: {conflictList.length}
          </span>
          <button onClick={exportJSON}>💾 Экспорт JSON</button>
          <button onClick={() => window.print()}>🖨 Печать</button>
          <button className="danger" onClick={resetAll}>Сброс</button>
        </div>

        {conflictList.length > 0 && (
          <div className="conflicts no-print">
            <b>Обнаружены конфликты:</b>
            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
              {conflictList.slice(0, 5).map((arr, i) => {
                const l = arr[0];
                return (
                  <li key={i}>
                    Неделя {l.week}, {DAYS[l.day]}, {SLOTS[l.slot]} — пересечение
                    ({arr.map(x => state.subjects.find(s => s.id === x.subjectId)?.name).join(", ")})
                  </li>
                );
              })}
              {conflictList.length > 5 && <li>…и ещё {conflictList.length - 5}</li>}
            </ul>
          </div>
        )}

        <table className="grid">
          <thead>
            <tr>
              <th style={{ width: 130 }}>Пара / День</th>
              {DAYS.map((d, i) => <th key={i}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((label, slot) => (
              <tr key={slot}>
                <th style={{ textAlign: "left", fontWeight: 500 }}>{label}</th>
                {DAYS.map((_, day) => (
                  <LessonCell
                    key={day}
                    week={week} day={day} slot={slot}
                    lessons={state.lessons}
                    subjects={state.subjects}
                    teachers={state.teachers}
                    groups={state.groups}
                    conflicts={conflicts}
                    onDropLesson={dropLesson}
                    onOpenLesson={(cell) => {
                      const existing = state.lessons.find(l =>
                        l.week === cell.week && l.day === cell.day && l.slot === cell.slot);
                      setModal(existing || {
                        id: null,
                        week: cell.week, day: cell.day, slot: cell.slot,
                        subjectId: "", teacherId: "", room: "", type: "lec"
                      });
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="no-print" style={{ color: "#7b879b", fontSize: 12, marginTop: 10 }}>
          Двойной клик по ячейке — новое занятие · Двойной клик по занятию — редактирование ·
          Перетаскивание мышью — перемещение занятия.
        </p>
      </main>

      {modal && (
        <LessonModal
          lesson={modal}
          subjects={state.subjects}
          teachers={state.teachers}
          groups={state.groups}
          onSave={saveLesson}
          onDelete={deleteLesson}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.App = App;