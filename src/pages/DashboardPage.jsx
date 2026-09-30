import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppointments } from '../hooks/useAppointments';
import AppointmentCard from '../components/AppointmentCard';
import RescheduleModal from '../components/RescheduleModal';
import ErrorBanner from '../components/ErrorBanner';
import Loader from '../components/Loader';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { status, items, error, load, cancel, reschedule, clearError } = useAppointments();
  const [editing, setEditing] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (a) => {
    if (!window.confirm(`¿Cancelar la cita con ${a.doctor} el ${a.date}?`)) return;
    try { await cancel(a.id); } catch (e) { alert(e.message); }
  };

  const visible = showAll ? items : items.filter((a) => a.status === 'programada');

  return (
    <main className="dash">
      <header>
        <h1>Hola, {user.name}</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </header>
      <label className="check">
        <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> Mostrar también canceladas
      </label>
      <ErrorBanner message={error} onClose={clearError} />
      {status === 'loading' && <Loader text="Cargando tus citas…" />}
      {status === 'error' && <button onClick={load}>Reintentar</button>}
      {status === 'ready' && visible.length === 0 && <p>No tienes citas próximas.</p>}
      {visible.map((a) => (
        <AppointmentCard key={a.id} appointment={a} onCancel={handleCancel} onReschedule={setEditing} />
      ))}
      {editing && <RescheduleModal appointment={editing} onConfirm={reschedule} onClose={() => setEditing(null)} />}
    </main>
  );
}
