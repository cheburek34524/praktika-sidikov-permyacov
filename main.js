window.App = function App() {
  const { useState, useEffect, useMemo } = React;

  // Состояние: группы, преподаватели, дисциплины, занятия
  const [state, setState] = useState(() => loadState());
  const [week, setWeek] = useState(1);
  const [modalLesson, setModalLesson] = useState(null); // null = модалка закрыта

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem(window.LS_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  // Удобные сеттеры для отдельных сущностей
  const setGroups    = (groups)    => setState(s => ({ ...s, groups }));
  const setTeachers  = (teachers)  => setState(s => ({ ...s, teachers }));
  const setSubjects  = (subjects)  => setState(s => ({ ...s, subjects }));
  const setLessons   = (lessons)   => setState(s => ({ ...s, lessons }));

  // Конфликты считаются один раз на все занятия
  const conflicts = useMemo(() => findConflicts(state.lessons), [state.lessons]);

  // --- Работа с занятиями ---

  const openNewLesson = ({ week, day, slot }) => {
    setModalLesson({
      id: "",
      week,
      day,
      slot,
      subjectId: "",
      teacherId: "",
      room: "",
      type: "lec"
    });
  };

  const openExistingLesson = (lesson) => {
    setModalLesson({ ...lesson });
  };

  const saveLesson = (form) => {
    setState(s => {
      const exists = s.lessons.some(l => l.id === form.id);
      if (exists) {
        // Редактирование
        return {
          ...s,
          lessons: s.lessons.map(l => l.id === form.id ? form : l)
        };
      } else {
        // Новое занятие
        const newLesson = { ...form, id: uid() };
        return { ...s, lessons: [...s.lessons, newLesson] };
      }
    });
    setModalLesson(null);
  };

  const deleteLesson = (id) => {
    setState(s => ({ ...s, lessons: s.lessons.filter(l => l.id !== id) }));
    setModalLesson(null);
  };

  const dropLesson = (id, week, day, slot) => {
    setState(s => ({
      ...s,
      lessons: s.lessons.map(l =>
        l.id === id ? { ...l, week, day, slot } : l
      )
    }));
  };

  // --- Рендер ---

  return (
    <div className="app">
      {/* ЛЕВАЯ ПАНЕЛЬ */}
      <aside className="sidebar">
        <h1>Расписание</h1>

        <GroupsPanel
          groups={state.groups}
          subjects={state.subjects}
          onChange={setGroups}
        />

        <TeachersPanel
          teachers={state.teachers}
          subjects={state.subjects}
          onChange={setTeachers}
        />

        <SubjectsPanel
          subjects={state.subjects}
          groups={state.groups}
          teachers={state.teachers}
          onChange={setSubjects}
        />
      </aside>

      {/* ОСНОВНАЯ ЧАСТЬ */}
      <main className="main">
        <div className="toolbar no-print">
          <div className="weeks">
            <button
              className={week === 1 ? "active" : ""}
              onClick={() => setWeek(1)}
            >1-я неделя</button>
            <button
              className={week === 2 ? "active" : ""}
              onClick={() => setWeek(2)}
            >2-я неделя</button>
          </div>

          <button onClick={() => window.print()}>🖨 Печать</button>
        </div>

        {/* Плашка конфликтов */}
        {conflicts.size > 0 && (
          <div className="conflicts">
            ⚠️ Обнаружены конфликты: {conflicts.size} занятий пересекаются
            по преподавателю или аудитории.
          </div>
        )}

        {/* Заголовок для печати */}
        <h1 className="print-title">
          Расписание · {week}-я неделя
        </h1>

        {/* Сетка */}
        <table className="grid">
          <thead>
            <tr>
              <th style={{ width: 110 }}>Пара</th>
              {window.DAYS.map((d, i) => <th key={i}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {window.SLOTS.map((slotName, slotIdx) => (
              <tr key={slotIdx}>
                <th>{slotName}</th>
                {window.DAYS.map((_, dayIdx) => (
                  <LessonCell
                    key={`${slotIdx}-${dayIdx}`}
                    week={week}
                    day={dayIdx}
                    slot={slotIdx}
                    lessons={state.lessons}
                    subjects={state.subjects}
                    teachers={state.teachers}
                    groups={state.groups}
                    conflicts={conflicts}
                    onDropLesson={dropLesson}
                    onOpenLesson={(data) => {
                      if (data.id) openExistingLesson(data);
                      else openNewLesson(data);
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* МОДАЛКА */}
      {modalLesson && (
        <LessonModal
          key={modalLesson.id || "new"}
          lesson={modalLesson}
          subjects={state.subjects}
          teachers={state.teachers}
          groups={state.groups}
          onSave={saveLesson}
          onDelete={deleteLesson}
          onClose={() => setModalLesson(null)}
        />
      )}
    </div>
  );
};

// Точка входа
ReactDOM.createRoot(document.getElementById("root")).render(<App />);