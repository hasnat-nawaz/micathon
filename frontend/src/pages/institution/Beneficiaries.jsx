import { useEffect, useState } from "react";
import api from "../../api/client.js";

export default function Beneficiaries() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", reference_code: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = () => api.get("/beneficiaries").then(({ data }) => setList(data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await api.post("/beneficiaries", form);
      setForm({ name: "", reference_code: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="container">
      <div className="page-header"><h1>Beneficiaries</h1><p className="sub">People served by your institution. Link them to needs.</p></div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" }}>
        <form className="card form" onSubmit={add}>
          <h3>Add beneficiary</h3>
          {error && <div className="banner-error">{error}</div>}
          <div className="form-row">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-row">
            <label>Reference code (optional)</label>
            <input value={form.reference_code} onChange={(e) => setForm((f) => ({ ...f, reference_code: e.target.value }))} placeholder="e.g. STU-2024-001" />
          </div>
          <button className="btn btn-primary" disabled={busy}>{busy ? "Adding…" : "Add"}</button>
        </form>

        <div>
          {list.length === 0 ? (
            <div className="empty"><div className="icon">👥</div><p>No beneficiaries yet.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Reference</th><th>Added</th></tr></thead>
              <tbody>
                {list.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.name}</strong></td>
                    <td>{b.reference_code || "—"}</td>
                    <td>{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
