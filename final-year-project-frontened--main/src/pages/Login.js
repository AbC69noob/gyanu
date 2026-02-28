import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e, retryCount = 0) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      const loginPayload = {
        username: username.trim(),
        password: password.trim(),
      };
      
      console.log('Attempting login with:', { ...loginPayload, password: '***' });
      console.log('Password length:', password.length);

      const res = await api.post("/api/auth/login", loginPayload);
      
      console.log('Login successful:', { ...res.data, token: '***' });

      login({
        accessToken: res.data.token,
        refreshToken: res.data.token,
        role: res.data.role
      });

      navigate("/dashboard");
    } catch (err) {
      console.error('Login error:', err.response?.data);
      
      // If it's an invalid credentials error and this is a first attempt, try once more after a delay
      if (err.response?.status === 400 && retryCount === 0) {
        setTimeout(() => {
          handleLogin(e, 1);
        }, 2000);
        return;
      }
      
      setError(
        err.response?.data?.message ||
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Digital Attendance System</h2>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <a href="/forgot-password" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "14px" }}>
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
