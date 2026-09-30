import { createContext, useCallback, useMemo, useReducer } from 'react';
import * as api from '../services/appointmentService';
import { useAuth } from '../hooks/useAuth';

export const AppointmentsContext = createContext(null);

const initial = { status: 'idle', items: [], error: null }; // idle|loading|ready|error

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { ...state, status: 'loading', error: null };
    case 'FETCH_OK':    return { status: 'ready', items: action.payload, error: null };
    case 'FETCH_ERROR': return { ...state, status: 'error', error: action.error };
    case 'UPDATE':      return { ...state, items: state.items.map((a) => (a.id === action.payload.id ? action.payload : a)) };
    case 'CLEAR_ERROR': return { ...state, error: null };
    default: return state;
  }
}

export function AppointmentsProvider({ children }) {
  const { user, token } = useAuth();
  const [state, dispatch] = useReducer(reducer, initial);

  const load = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try { dispatch({ type: 'FETCH_OK', payload: await api.getAppointments(user.id, token) }); }
    catch (e) { dispatch({ type: 'FETCH_ERROR', error: e.message }); }
  }, [user, token]);

  // Las acciones lanzan el error para que la UI (modal) también pueda mostrarlo.
  const cancel = useCallback(async (id) => {
    dispatch({ type: 'UPDATE', payload: await api.cancelAppointment(id, token) });
  }, [token]);

  const reschedule = useCallback(async (id, date, time) => {
    dispatch({ type: 'UPDATE', payload: await api.rescheduleAppointment(id, date, time, token) });
  }, [token]);

  const value = useMemo(() => ({ ...state, load, cancel, reschedule,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }) }), [state, load, cancel, reschedule]);
  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}
