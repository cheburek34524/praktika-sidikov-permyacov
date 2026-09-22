window.GroupsPanel = function GroupsPanel({ groups, subjects, onChange }) {
  const { useState } = React;
  const [name, setName] = useState("");
  const [course, setCourse] = useState(1);
  const [students, setStudents] = useState(20);

  const add = () => {
    if (!name.trim()) return;
    onChange([...groups, { id: uid(), name: name.trim(), course: +course, students: +students }]);
    setName("");
  };

  return (
    <section>
      <h2>Учебные группы</h2>
      <div className="row">
        <input placeholder="Название" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" min="1" max="6" style={{ width: 70 }}
               value={course} onChange={e => setCourse(e.target.value)} title="Курс" />
        <input type="number" min="1" style={{ width: 70 }}
               value={students} onChange={e => setStudents(e.target.value)} title="Студентов" />
      </div>
      <div className="row">
        <button className="primary" onClick={add}>+ Добавить группу</button>
      </div>

      {groups.length === 0 && <div className="empty">Нет групп</div>}

      {groups.map(g => (
        <div className="list-item" key={g.id}>
          <div className="grow">
            <b>{g.name}</b>
            <small>{g.course} курс · {g.students} чел. · дисциплин: {subjects.filter(s => s.groupId === g.id).length}</small>
          </div>
          <button className="danger" onClick={() => onChange(groups.filter(x => x.id !== g.id))}>×</button>
        </div>
      ))}
    </section>
  );
};