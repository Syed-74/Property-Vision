import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Set or clear axios default Authorization header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      if (api.defaults.headers) delete api.defaults.headers.common?.Authorization;
      localStorage.removeItem("token");
    }
  }, [token]);

  // Fetch profile when token is available
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        setLoadingProfile(true);
        const response = await api.get("/profile");
        // guard against different shapes: response.data or response.data.data
        const profile = response?.data?.data ?? response?.data ?? null;
        if (mounted) setUser(profile);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        // Token might be invalid; clear it to force re-login
        setToken(null);
        setUser(null);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [token]);

  // Auto-redirect: if logged-in admin, go to admin dashboard
  useEffect(() => {
    if (user?.role) {
      navigate("/admin/dashboard");
    }
  }, [user]);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      // Try common response shapes:
      // { data: { token, user } } or { token, user } or { data: user }
      const data = response?.data ?? null;
      const tokenFromResp = data?.token ?? data?.data?.token ?? data?.accessToken ?? null;
      const userFromResp = data?.user ?? data?.data ?? data ?? null;

      if (tokenFromResp) {
        setToken(tokenFromResp);
      }

      if (userFromResp) {
        setUser(userFromResp);
      } else if (!tokenFromResp) {
        // if neither token nor user exists, treat as failure
        throw new Error("Invalid login response from server");
      }

      // Return success
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally extract and return server message
      const message = error?.response?.data?.message ?? error.message ?? "Login failed";
      return { success: false, message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    // axios header cleared by token effect
    navigate("/");
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      loadingProfile,
    }),
    [user, token, login, logout, loadingProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
