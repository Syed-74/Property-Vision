import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Login = ({ onClose }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/v1/admin/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ Store token
      if (remember) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // ✅ Close modal (if used as popup)
      if (onClose) onClose();

      // ✅ Role-based redirect
      if (user?.role === "admin" || user?.role === "subadmin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        {/* MODAL */}
        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8">

          {/* CLOSE */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">
            Sign in to access your dashboard
          </p>

          {/* ERROR */}
          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center text-sm">
              {error}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9c4a1a]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border rounded-lg pr-12 focus:ring-2 focus:ring-[#9c4a1a]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="rounded border-gray-300 text-[#9c4a1a] focus:ring-[#9c4a1a]"
                />
                Remember me
              </label>
{/* 
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[#9c4a1a] hover:underline"
              >
                Forgot password?
              </button> */}
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full bg-[#9c4a1a] hover:bg-[#7f3c14] text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </>
  );
};

export default Login;
