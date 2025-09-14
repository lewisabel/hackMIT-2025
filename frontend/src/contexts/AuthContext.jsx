import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    }
    setLoading(false);
  };

  const signIn = async (email, password) => {
    try {
      console.log('AuthContext: Starting login request...');
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('AuthContext: Login response:', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // FIXED: Use the correct property names from your backend response
      localStorage.setItem('access_token', data.user.accessToken);
      setUser(data.user);
      
      console.log('AuthContext: Login successful, user set');
      return { data: data.user, error: null };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { data: null, error: error.message };
    }
  };

  const signUp = async (userData) => {
    try {
      console.log("signUp userData:", userData);

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};