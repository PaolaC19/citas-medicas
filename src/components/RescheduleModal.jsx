import { useState } from 'react';
import { validateReschedule } from '../utils/validators';
import ErrorBanner from './ErrorBanner';

export default function RescheduleModal({ appointment, onConfirm, onClose }) {
  const [form, setForm] = useState({ date: appointment.date, time: appointment.time });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const submit = async (e) => {
    e.preventDefault();
    const found = validateReschedule(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true); setApiError(null);
    try { await onConfirm(appointment.id, form.date, form.time); onClose(); }
    catch (err) { setApiError(err.message); } // p. ej. 409: horario ocupado
    finally { setSaving(false); }
  };

  return (
    <div className="overlay">
      <form className="modal" onSubmit={submit} noValidate>
        <h2>Reagendar cita</h2>
        <p>{appointment.doctor} · {appointment.specialty}</p>
        <ErrorBanner message={apiError} />
        <label>Fecha
          <input type="date" min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          {errors.date && <small>{errors.date}</small>}
        </label>
        <label>Hora
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          {errors.time && <small>{errors.time}</small>}
        </label>
        <div className="actions">
          <button type="button" onClick={onClose}>Volver</button>
          <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Confirmar'}</button>
        </div>
      </form>
    </div>
  );
}
