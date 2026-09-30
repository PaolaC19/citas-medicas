import { useContext } from 'react';
import { AppointmentsContext } from '../context/AppointmentsContext';
export const useAppointments = () => {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments debe usarse dentro de AppointmentsProvider');
  return ctx;
};
