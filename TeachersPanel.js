window.TeachersPanel = function TeachersPanel({ teachers, subjects, onChange }) {
  const { useState } = React;
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");

  const add = () => {
    if (!fullName.trim()) return;
    onChange([...teachers, { id: uid(), fullName: fullName.trim(), department: department.trim() }]);
    setFullName("");
    setDepartment("");
  };

  return (
    <section>
      <h2>Преподаватели</h2>
      <div className="row"><input placeholder="ФИО" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
      <div className="row"><input placeholder="Кафедра" value={department} onChange={e => setDepartment(e.target.value)} /></div>
      <div className="row"><button className="primary" onClick={add}>+ Добавить преподавателя</button></div>

      {teachers.length === 0 && <div className="empty">Нет преподавателей</div>}

      {teachers.map(t => (
        <div className="list-item" key={t.id}>
          <div className="grow">
            <b>{t.fullName}</b>
            <small>{t.department || "—"} · дисциплин: {subjects.filter(s => s.teacherIds.includes(t.id)).length}</small>
          </div>
          <button className="danger" onClick={() => onChange(teachers.filter(x => x.id !== t.id))}>×</button>
        </div>
      ))}
    </section>
  );
};