// Capa de acceso HTTP: único lugar donde se usa fetch y se traducen los errores.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const DEFAULT_MESSAGES = {
  400: 'Solicitud inválida',
  401: 'Sesión no autorizada',
  404: 'Recurso no encontrado',
  409: 'Conflicto con los datos existentes',
  500: 'Error interno del servidor',
};

export async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Intenta de nuevo.');
  }
  if (!res.ok) {
    let msg;
    try { msg = (await res.json()).message; } catch { /* sin cuerpo JSON */ }
    throw new ApiError(res.status, msg || DEFAULT_MESSAGES[res.status] || 'Error inesperado');
  }
  return res.json();
}
