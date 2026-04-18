import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/apiErrorMessage.js";

export default function Signup() {
  const [form, setForm] = useState({
    role: "donor", username: "", password: "", name: "",
    email: "", phone: "", type: "", location: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const user = await signup(form);
      navigate(user.role === "donor" ? "/donor-dashboard" : "/institution-dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Signup failed"));
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page auth-page--login-glass">
      <div className="auth-page__login-bg" aria-hidden="true" />
      <div className="auth-card auth-card--glass slide-up">
        <div className="auth-glass-chrome-bar">
          <span className="auth-glass-chrome-title">Sign up</span>
        </div>
        <h1>
          Join the <span className="head-accent">community</span>
        </h1>
        <p className="sub">Register as a donor or a verified institution.</p>
        <form className="form" onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="signup-role">I am a…</label>
            <select id="signup-role" value={form.role} onChange={(e) => update("role", e.target.value)}>
              <option value="donor">Donor</option>
              <option value="institution">Institution (school / NGO / vendor)</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="signup-name">
              {form.role === "donor" ? "Full name" : "Institution name"}
            </label>
            <input id="signup-name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="form-row">
            <label htmlFor="signup-username">Username</label>
            <input id="signup-username" value={form.username} onChange={(e) => update("username", e.target.value)} required autoComplete="username" />
          </div>
          <div className="form-row">
            <label htmlFor="signup-password">Password (min 6 chars)</label>
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="form-row">
            <label htmlFor="signup-email">Email (optional)</label>
            <input id="signup-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" />
          </div>
          <div className="form-row">
            <label htmlFor="signup-phone">Phone (optional)</label>
            <input id="signup-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" />
          </div>
          {form.role === "institution" && (
            <>
              <div className="form-row">
                <label htmlFor="signup-type">Type (e.g. School, NGO, Vendor)</label>
                <input id="signup-type" value={form.type} onChange={(e) => update("type", e.target.value)} />
              </div>
              <div className="form-row">
                <label htmlFor="signup-location">Location</label>
                <input id="signup-location" value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
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
