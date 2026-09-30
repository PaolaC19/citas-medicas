const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'El correo es obligatorio';
  else if (!EMAIL_RE.test(email)) errors.email = 'Formato de correo inválido';
  if (!password) errors.password = 'La contraseña es obligatoria';
  else if (password.length < 6) errors.password = 'Mínimo 6 caracteres';
  return errors;
}

export function validateReschedule({ date, time }) {
  const errors = {};
  if (!date) errors.date = 'Selecciona una fecha';
  if (!time) errors.time = 'Selecciona una hora';
  if (date && time && new Date(`${date}T${time}`) <= new Date())
    errors.date = 'La nueva fecha debe ser futura';
  return errors;
}
