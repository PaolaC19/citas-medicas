import { request } from './apiClient';
export const login = (email, password) => request('/login', { method: 'POST', body: { email, password } });
