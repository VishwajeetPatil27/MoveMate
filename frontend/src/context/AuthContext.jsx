import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('movemate_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('movemate_token');
      if (storedToken) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session restoration failed, clearing token');
          localStorage.removeItem('movemate_token');
          localStorage.removeItem('movemate_refresh_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthResponse = (data) => {
    localStorage.setItem('movemate_token', data.token);
    localStorage.setItem('movemate_refresh_token', data.refreshToken);
    setToken(data.token);
    setUser(data.user);
    setError(null);
    return data.user;
  };

  const login = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginUser(payload);
      return handleAuthResponse(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await registerUser(payload);
      handleAuthResponse(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check input values.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('movemate_token');
    localStorage.removeItem('movemate_refresh_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

