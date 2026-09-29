import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('recipe-book-token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('recipe-book-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('recipe-book-token', token);
    } else {
      localStorage.removeItem('recipe-book-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('recipe-book-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('recipe-book-user');
    }
  }, [user]);

  useEffect(() => {
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const register = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
