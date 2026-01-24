import { useState } from "react";
import api from "../../api/axios";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/v1/admin/forgot-password", { email });
      setSuccess("Reset link sent to your email");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-sm rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Forgot Password
        </h3>

        {success ? (
          <p className="text-green-600 text-center">{success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-[#9c4a1a] text-white py-2 rounded"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="text-sm text-gray-500 w-full text-center"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
