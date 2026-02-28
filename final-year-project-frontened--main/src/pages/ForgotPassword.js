import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      console.log('Sending forgot password request for:', trimmedEmail);
      
      const response = await api.post("/api/auth/forgot-password", { 
        email: trimmedEmail,
        username: trimmedEmail // Send both email and username in case backend expects username
      });
      
      console.log('Forgot password response:', response.data);
      navigate("/verify-otp", { state: { email: trimmedEmail } });
    } catch (err) {
      console.error('Forgot password error:', err.response?.data);
      setError(err.response?.data?.message || "User not found. Please check your email/username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Forgot Password</h2>
        <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>Enter your email or username</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Get OTP"}
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

export default ForgotPassword;
