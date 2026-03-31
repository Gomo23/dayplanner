import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const Ctx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    setLoading(false);
  }, []);

  const save = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
    setUser({ name: data.name, email: data.email });
  };

  const login    = async (e, p) => { const r = await authAPI.login({ email: e, password: p }); save(r.data); };
  const register = async (n, e, p) => { const r = await authAPI.register({ name: n, email: e, password: p }); save(r.data); };
  const logout   = () => { localStorage.clear(); setUser(null); };

  return <Ctx.Provider value={{ user, login, register, logout, loading }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
