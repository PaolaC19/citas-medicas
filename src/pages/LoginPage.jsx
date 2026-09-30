import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateLogin } from '../utils/validators';
import ErrorBanner from '../components/ErrorBanner';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true); setApiError(null);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setApiError(err.message); } // 401 u otros errores
    finally { setLoading(false); }
  };

  return (
    <main className="login">
      <form className="modal" onSubmit={submit} noValidate>
        <h1>MediCitas</h1>
        <ErrorBanner message={apiError} />
        <label>Correo
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <small>{errors.email}</small>}
        </label>
        <label>Contraseña
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {errors.password && <small>{errors.password}</small>}
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Ingresando…' : 'Ingresar'}</button>
        <p className="hint">Demo: laura@correo.com / 123456</p>
      </form>
    </main>
  );
}
