import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "../styles/Login.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log('Sending reset password request for:', email);
      console.log('New password length:', newPassword.length);
      
      const payload = { 
        email: email.trim().toLowerCase(),
        username: email.trim().toLowerCase(), // Send both email and username
        newPassword: newPassword.trim(),
        password: newPassword.trim()
      };
      
      console.log('Reset payload:', { ...payload, newPassword: '***', password: '***' });
      
      const response = await api.post("/api/auth/reset-password", payload);
      console.log('Password reset response:', response.data);
      
      // Clear any cached data and force refresh
      localStorage.clear();
      sessionStorage.clear();
      
      // Add a small delay to ensure database transaction completes
      setTimeout(() => {
        alert("Password reset successful! Please login with your new password.");
        navigate("/login", { replace: true });
        window.location.reload(); // Force page refresh
      }, 1000);
      
    } catch (err) {
      console.error('Password reset error:', err.response?.data);
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password</h2>
        <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>Enter your new password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button type="button" onClick={() => navigate("/login")} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
