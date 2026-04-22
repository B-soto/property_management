// AuthContext - Global authentication state management
import React, { createContext, useContext, useState, useEffect } from 'react';
import AxiosInstance from '../components/Axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        setLoading(false);
        return;
      }

      // Verify token is still valid by making a test request
      const response = await AxiosInstance.get('/projectmanager/', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
      setUser({
        id: tokenData.user_id,
        username: tokenData.username,
        role: tokenData.role || 'landlord',
      });
      setIsAuthenticated(true);
      
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await AxiosInstance.post('/api/token/', {
        username,
        password
      });

      const { access, refresh } = response.data;
      
      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const tokenData = JSON.parse(atob(access.split('.')[1]));
      const role = tokenData.role || 'landlord';
      setUser({
        id: tokenData.user_id,
        username: tokenData.username || username,
        role,
      });
      setIsAuthenticated(true);

      return { success: true, role };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    try {
      const response = await AxiosInstance.post('/api/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;