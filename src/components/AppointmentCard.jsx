export default function AppointmentCard({ appointment: a, onCancel, onReschedule }) {
  const active = a.status === 'programada';
  return (
    <article className={`card ${a.status}`}>
      <div>
        <h3>{a.doctor}</h3>
        <p>{a.specialty}</p>
        <p><strong>{a.date}</strong> · {a.time}</p>
        <span className="tag">{a.status}</span>
      </div>
      {active && (
        <div className="actions">
          <button onClick={() => onReschedule(a)}>Reagendar</button>
          <button className="danger" onClick={() => onCancel(a)}>Cancelar</button>
        </div>
      )}
    </article>
  );
}
