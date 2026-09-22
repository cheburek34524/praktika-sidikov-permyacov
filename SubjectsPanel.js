window.SubjectsPanel = function SubjectsPanel({ subjects, groups, teachers, onChange }) {
  const { useState } = React;
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [teacherIds, setTeacherIds] = useState([]);

  const add = () => {
    if (!name.trim() || !groupId || teacherIds.length === 0) {
      alert("Укажите название, группу и хотя бы одного преподавателя");
      return;
    }
    onChange([...subjects, { id: uid(), name: name.trim(), groupId, teacherIds }]);
    setName(""); setGroupId(""); setTeacherIds([]);
  };

  const toggleTeacher = (id) => {
    setTeacherIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <section>
      <h2>Дисциплины</h2>
      <div className="row">
        <input placeholder="Название дисциплины" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="row">
        <select value={groupId} onChange={e => setGroupId(e.target.value)}>
          <option value="">— группа —</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 12, color: "#4a5468", margin: "6px 0" }}>Преподаватели:</div>
      <div style={{ maxHeight: 120, overflowY: "auto", border: "1px solid #e6eaf3", borderRadius: 6, padding: 6, marginBottom: 6 }}>
        {teachers.length === 0 && <div className="empty">Сначала добавьте преподавателей</div>}
        {teachers.map(t => (
          <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "2px 0" }}>
            <input type="checkbox" style={{ width: "auto" }}
                   checked={teacherIds.includes(t.id)}
                   onChange={() => toggleTeacher(t.id)} />
            {t.fullName}
          </label>
        ))}
      </div>
      <div className="row"><button className="primary" onClick={add}>+ Добавить дисциплину</button></div>

      {subjects.length === 0 && <div className="empty">Нет дисциплин</div>}

      {subjects.map(s => {
        const g = groups.find(x => x.id === s.groupId);
        return (
          <div className="list-item" key={s.id}>
            <div className="grow">
              <b>{s.name}</b>
              <small>
                {g ? g.name : "?"} ·{" "}
                {s.teacherIds.map(id => teachers.find(t => t.id === id)?.fullName).filter(Boolean).join(", ")}
              </small>
            </div>
            <button className="danger" onClick={() => onChange(subjects.filter(x => x.id !== s.id))}>×</button>
          </div>
        );
      })}
    </section>
  );
};
