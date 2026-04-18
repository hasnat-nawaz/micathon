import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/apiErrorMessage.js";

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
      setError(getApiErrorMessage(err, "Login failed"));
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-up">
        <h1>Welcome back</h1>
        <p className="sub">Sign in to continue your impact.</p>
        {error && <div className="banner-error" style={{ marginBottom: 16 }}>{error}</div>}
        <form className="form" onSubmit={submit}>
          <div className="form-row">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </div>
        <div className="banner-info" style={{ marginTop: 18, fontSize: 13 }}>
          <strong>Demo:</strong> alice / password (donor) · hopeschool / password (institution)
        </div>
      </div>
    </div>
  );
}
