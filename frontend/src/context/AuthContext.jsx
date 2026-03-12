import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext(null);

// Mock users — replace with real API calls
const MOCK_USERS = [
  { id: 1, name: 'Samuel', email: 'superadmin@mailflow.com', password: 'admin123', role: 'superadmin' },
  { id: 2, name: 'Grace ', email: 'admin@mailflow.com', password: 'admin123', role: 'admin' },
  { id: 3, name: 'Che', email: 'user@mailflow.com', password: 'user123', role: 'user' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mf_user')); } catch { return null; }
  });

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _, ...safe } = found;
    setUser(safe);
    localStorage.setItem('mf_user', JSON.stringify(safe));
    return safe;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mf_user');
  };

  const can = (roles) => roles.includes(user?.role);

  return <AuthCtx.Provider value={{ user, login, logout, can }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
