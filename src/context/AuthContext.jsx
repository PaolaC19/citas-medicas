import { createContext, useCallback, useMemo, useState } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);
const KEY = 'medicitas_session';

const readSession = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession); // {token,user} | null

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem(KEY, JSON.stringify(data)); // persistencia de sesión
    setSession(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ ...session, isAuthenticated: !!session, login, logout }),
    [session, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
