import { createContext, useContext, useState } from "react";

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Login function
  const login = (email) => {
    setUser({ email });
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook (cleaner usage)
export function useAuth() {
  return useContext(AuthContext);
}