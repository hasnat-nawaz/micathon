import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client.js";

const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg";

export default function NewNeed() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount_required: "",
    tag: "education",
    priority: 1,
    beneficiary_id: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/beneficiaries")
      .then(({ data }) => setBeneficiaries(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onImageChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    e.target.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description || "");
        fd.append("amount_required", String(Number(form.amount_required)));
        fd.append("tag", form.tag);
        fd.append("priority", String(Number(form.priority)));
        if (form.beneficiary_id) fd.append("beneficiary_id", form.beneficiary_id);
        fd.append("image", imageFile);
        await api.post("/needs", fd);
      } else {
        const payload = {
          ...form,
          amount_required: Number(form.amount_required),
          priority: Number(form.priority),
        };
        if (!payload.beneficiary_id) delete payload.beneficiary_id;
        await api.post("/needs", payload);
      }
      navigate("/institution-dashboard/needs");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create need");
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
              <span style={{ fontSize: 16 }}>➕</span>
              New need
            </div>
            <h1 className="dashboard-hero__title">Post a verified need</h1>
            <p className="dashboard-hero__lead">Be specific — donors fund clarity. Add amount, story, category, and optional proof image.</p>
          </div>
        </div>
      </section>

      <section className="section inst-content-band reveal" style={{ background: "var(--gray-50)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          {error && <div className="banner-error reveal" style={{ marginBottom: 20 }}>{error}</div>}
          <form className="form inst-panel inst-panel--padded reveal" onSubmit={submit}>
            <div className="form-row">
              <label>Title</label>
              <input value={form.title} onChange={(e) => update("title", e.target.value)} required placeholder="e.g. School fees for Sara, Grade 6" />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="What are the funds for? Who benefits? How will you confirm fulfillment?"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-row">
                <label>Amount required (Rs.)</label>
                <input type="number" min={1} value={form.amount_required} onChange={(e) => update("amount_required", e.target.value)} required />
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
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.reference_code ? `(${b.reference_code})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <label>Image (optional)</label>
              <input type="file" accept={ACCEPT} onChange={onImageChange} />
              <p className="sub" style={{ marginTop: 8, marginBottom: 0 }}>
                PNG, JPEG, WebP, or SVG — max 2 MB. Stored on the server for this testing phase.
              </p>
              {imagePreview && (
                <div
                  style={{
                    marginTop: 12,
                    width: "100%",
                    maxWidth: 360,
                    height: 180,
                    borderRadius: "var(--radius)",
                    backgroundImage: `url(${imagePreview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid var(--gray-200)",
                  }}
                />
              )}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-block" style={{ flex: "1 1 200px" }} disabled={busy}>
                {busy ? "Posting…" : "Post need"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
