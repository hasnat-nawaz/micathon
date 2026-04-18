import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client.js";

export default function NewNeed() {
  const [form, setForm] = useState({
    title: "", description: "", amount_required: "",
    tag: "education", priority: 1, image_url: "", beneficiary_id: "",
  });
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/beneficiaries").then(({ data }) => setBeneficiaries(data)).catch(() => {});
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const payload = { ...form, amount_required: Number(form.amount_required), priority: Number(form.priority) };
      if (!payload.beneficiary_id) delete payload.beneficiary_id;
      await api.post("/needs", payload);
      navigate("/institution-dashboard/needs");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create need");
    } finally { setBusy(false); }
  };

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div className="page-header reveal"><h1>Post a new need</h1><p className="sub">Be specific — donors fund clarity.</p></div>
      {error && <div className="banner-error" style={{ marginBottom: 16 }}>{error}</div>}
      <form className="form card reveal" onSubmit={submit}>
        <div className="form-row">
          <label>Title</label>
          <input value={form.title} onChange={(e) => update("title", e.target.value)} required placeholder="e.g. School fees for Sara, Grade 6" />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="What are the funds for? Who benefits? How will you confirm fulfillment?" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="form-row">
            <label>Amount required (Rs.)</label>
            <input type="number" min="1" value={form.amount_required} onChange={(e) => update("amount_required", e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Priority (1–3)</label>
            <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              <option value={1}>1 — Normal</option>
              <option value={2}>2 — Important</option>
              <option value={3}>3 — Urgent</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="form-row">
            <label>Tag</label>
            <select value={form.tag} onChange={(e) => update("tag", e.target.value)}>
              <option value="education">Education</option>
              <option value="food">Food</option>
              <option value="health">Health</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="form-row">
            <label>Beneficiary (optional)</label>
            <select value={form.beneficiary_id} onChange={(e) => update("beneficiary_id", e.target.value)}>
              <option value="">— None —</option>
              {beneficiaries.map((b) => <option key={b.id} value={b.id}>{b.name} {b.reference_code ? `(${b.reference_code})` : ""}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <label>Image URL (optional)</label>
          <input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="https://… (bill, photo, etc.)" />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Posting…" : "Post need"}</button>
        </div>
      </form>
    </div>
  );
}
