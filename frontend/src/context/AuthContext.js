import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    const normalizedUser = {
      userId: userData.userId || userData._id,
      username: userData.username,
      email: userData.email,
      bio: userData.bio || '',
      profilePicture: userData.profilePicture || ''
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
