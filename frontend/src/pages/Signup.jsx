import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
      setError(err.response?.data?.error || "Signup failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-up">
        <h1>Create account</h1>
        <p className="sub">Join as a donor or a verified institution.</p>
        {error && <div className="banner-error" style={{ marginBottom: 16 }}>{error}</div>}
        <form className="form" onSubmit={submit}>
          <div className="form-row">
            <label>I am a…</label>
            <select value={form.role} onChange={(e) => update("role", e.target.value)}>
              <option value="donor">Donor</option>
              <option value="institution">Institution (school / NGO / vendor)</option>
            </select>
          </div>
          <div className="form-row">
            <label>{form.role === "donor" ? "Full name" : "Institution name"}</label>
            <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Username</label>
            <input value={form.username} onChange={(e) => update("username", e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Password (min 6 chars)</label>
            <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={6} />
          </div>
          <div className="form-row">
            <label>Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="form-row">
            <label>Phone (optional)</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          {form.role === "institution" && (
            <>
              <div className="form-row">
                <label>Type (e.g. School, NGO, Vendor)</label>
                <input value={form.type} onChange={(e) => update("type", e.target.value)} />
              </div>
              <div className="form-row">
                <label>Location</label>
                <input value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
            </>
          )}
          <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
