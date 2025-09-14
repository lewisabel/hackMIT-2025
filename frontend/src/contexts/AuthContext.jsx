import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

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
          console.log('CheckUser: Setting user from token:', data.user);
          setUser(data.user);
        } else {
          // Token is invalid, remove it
          console.log('CheckUser: Invalid token, removing');
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        localStorage.removeItem('access_token');
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

      localStorage.setItem('access_token', data.user.accessToken);
      setUser(data.user);
      
      console.log('AuthContext: Login successful, user set to:', data.user);
      console.log('AuthContext: User role:', data.user.role);
      
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
    console.log('AuthContext: Signing out user');
    localStorage.removeItem('access_token');
    setUser(null);
  };

  // Legacy method names for backward compatibility
  const login = signIn;
  const logout = signOut;

  // Legacy property name for backward compatibility
  const isLoading = loading;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      isLoading,
      signIn, 
      signUp, 
      signOut,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};