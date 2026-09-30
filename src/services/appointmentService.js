import { request } from './apiClient';
export const getAppointments = (userId, token) =>
  request(`/appointments?userId=${userId}&_sort=date,time`, { token });
export const cancelAppointment = (id, token) =>
  request(`/appointments/${id}`, { method: 'PATCH', body: { status: 'cancelada' }, token });
export const rescheduleAppointment = (id, date, time, token) =>
  request(`/appointments/${id}`, { method: 'PATCH', body: { date, time, status: 'programada' }, token });
