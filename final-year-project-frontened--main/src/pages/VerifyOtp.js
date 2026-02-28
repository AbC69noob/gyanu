import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "../styles/Login.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedOtp = otp.trim();
      
      console.log('Verifying OTP for:', trimmedEmail, 'OTP:', trimmedOtp);
      
      await api.post("/api/auth/verify-otp", { 
        email: trimmedEmail,
        username: trimmedEmail,
        otp: trimmedOtp 
      });
      
      navigate("/reset-password", { state: { email: trimmedEmail } });
    } catch (err) {
      console.error('OTP verification error:', err.response?.data);
      setError(err.response?.data?.message || "Invalid OTP or user not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Verify OTP</h2>
        <p style={{ marginBottom: "20px", color: "#cbd5e1" }}>Enter the OTP sent to {email}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
          {error && <div className="error-message">{error}</div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
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

export default VerifyOtp;
