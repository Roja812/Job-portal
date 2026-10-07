import { createContext, useContext, useState } from 'react';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const save = u => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); };
  const login = d => { localStorage.setItem('token', d.token); save(d.user); };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout, save }}>{children}</Ctx.Provider>;
}
