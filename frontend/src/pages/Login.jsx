import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/apiErrorMessage.js";

function loginErrorMessage(err) {
  const status = err?.response?.status;
  const apiErr = err?.response?.data?.error;
  if (status === 401) return "Incorrect login credentials.";
  if (typeof apiErr === "string" && /invalid credentials/i.test(apiErr)) {
    return "Incorrect login credentials.";
  }
  return getApiErrorMessage(err, "Incorrect login credentials.");
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const user = await login(username, password);
      navigate(user.role === "donor" ? "/donor-dashboard" : "/institution-dashboard");
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page auth-page--login-glass">
      <div className="auth-page__login-bg" aria-hidden="true" />
      <div className="auth-card auth-card--glass slide-up">
        <div className="auth-glass-chrome-bar">
          <span className="auth-glass-chrome-title">Login</span>
        </div>
        <h1>
          Welcome <span className="head-accent">back</span>
        </h1>
        <p className="sub">Sign in to continue your impact.</p>
        <form className="form" onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="form-row">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </div>
        {error && (
          <div className="auth-card-footer-error" role="alert">
            <p className="auth-login-error">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
