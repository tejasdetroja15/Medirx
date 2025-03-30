import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    // Check if user is already logged in on mount
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/users/profile`);
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        // User is not logged in or token expired
        console.log("Not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      return {
        success: true,
        message: response.data.message,
        email: userData.email,
      };
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/verify-email`, {
        email,
        otp,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
      return {
        success: false,
        message: error.response?.data?.message || "Verification failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/resend-otp`, {
        email,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
      return {
        success: false,
        message: error.response?.data?.message || "Failed to resend OTP",
      };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/forgot-password`, {
        email,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      setError(error.response?.data?.message || "Failed to process request");
      return {
        success: false,
        message: error.response?.data?.message || "Failed to process request",
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/reset-password`, {
        token,
        password,
        confirmPassword,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      setError(error.response?.data?.message || "Password reset failed");
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.get(`${API_URL}/users/logout`);
      setUser(null);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || "Logout failed");
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        verifyEmail,
        resendOTP,
        forgotPassword,
        resetPassword,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
