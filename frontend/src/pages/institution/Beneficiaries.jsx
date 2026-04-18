import { useEffect, useState } from "react";
import api from "../../api/client.js";

export default function Beneficiaries() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", reference_code: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/beneficiaries").then(({ data }) => setList(data));
  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/beneficiaries", form);
      setForm({ name: "", reference_code: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="dashboard-hero dashboard-hero--single dashboard-hero--institution">
        <div className="dashboard-hero__glow" aria-hidden />
        <div className="container">
          <div className="dashboard-hero__narrow">
            <div className="hero-tag">
              <span style={{ fontSize: 16 }}>👥</span>
              Beneficiaries
            </div>
            <h1 className="dashboard-hero__title">People you serve</h1>
            <p className="dashboard-hero__lead">Add beneficiaries with optional reference codes, then link them when posting needs.</p>
          </div>
        </div>
      </section>

      <section className="section inst-content-band reveal" style={{ background: "var(--gray-50)" }}>
        <div className="container">
          <div className="inst-beneficiary-layout">
            <form className="form inst-panel inst-panel--padded reveal" onSubmit={add}>
              <span className="tag tag-blue" style={{ marginBottom: 12, display: "inline-block" }}>
                Add new
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add beneficiary</h3>
              {error && <div className="banner-error" style={{ marginBottom: 14 }}>{error}</div>}
              <div className="form-row">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-row">
                <label>Reference code (optional)</label>
                <input
                  value={form.reference_code}
                  onChange={(e) => setForm((f) => ({ ...f, reference_code: e.target.value }))}
                  placeholder="e.g. STU-2024-001"
                />
              </div>
              <button className="btn btn-primary" disabled={busy} type="submit">
                {busy ? "Adding…" : "Add beneficiary"}
              </button>
            </form>

            <div className="reveal" style={{ transitionDelay: "80ms" }}>
              {list.length === 0 ? (
                <div className="inst-panel inst-panel--padded empty" style={{ textAlign: "center", padding: "40px 24px" }}>
                  <div className="icon" style={{ fontSize: 40 }}>
                    👥
                  </div>
                  <p style={{ marginTop: 12, color: "var(--gray-600)" }}>No beneficiaries yet.</p>
                </div>
              ) : (
                <div className="inst-panel">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Reference</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <strong>{b.name}</strong>
                          </td>
                          <td>{b.reference_code || "—"}</td>
                          <td>{new Date(b.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
