# MediCitas · Panel de usuario para reservas médicas

Panel front-end (React + Vite) para consultar, cancelar y reagendar citas médicas, con autenticación,
API REST simulada (json-server) y estado global con Context API + useReducer.

## Ejecutar
```bash
npm install
npm start        # levanta la API (3001) y la app (5173)
```
Usuarios demo: `laura@correo.com / 123456` · `carlos@correo.com / abcdef`

## Arquitectura (separación de capas)
| Carpeta | Responsabilidad |
|---|---|
| `services/` | Acceso HTTP (`apiClient` centraliza fetch y errores) |
| `context/` | Estado global: sesión y citas (reducer) |
| `hooks/` | `useAuth`, `useAppointments`: única puerta de entrada al estado |
| `components/`, `pages/`, `routes/` | Presentación y navegación (`ProtectedRoute`) |
| `utils/` | Validaciones puras |

## API
| Método | Endpoint | Uso | Errores |
|---|---|---|---|
| POST | `/login` | Iniciar sesión | 401 |
| GET | `/appointments?userId=` | Listar citas | 500 / red |
| PATCH | `/appointments/:id` | Cancelar (`status`) o reagendar (`date`,`time`) | 404, 409 |

