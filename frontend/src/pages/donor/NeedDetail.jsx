import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/client.js";
import { needCategoryTagClass } from "../../utils/needTagClass.js";

const PAY_METHODS = [
  { id: "easypaisa", label: "EasyPaisa", logoSrc: "/payments/easypaisa.png" },
  { id: "jazzcash", label: "JazzCash", logoSrc: "/payments/jazzcash.png" },
  { id: "card", label: "Mastercard", logoSrc: "/payments/mastercard.png" },
];

export default function NeedDetail() {
  const { id } = useParams();
  const [need, setNeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("easypaisa");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [celebration, setCelebration] = useState(null);

  const load = () => {
    setLoading(true);
    api.get(`/needs/${id}`).then(({ data }) => setNeed(data)).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (!celebration) return;
    const t = setTimeout(() => setCelebration(null), 5000);
    return () => clearTimeout(t);
  }, [celebration]);

  if (loading) return <div className="container"><div className="spinner" /></div>;
  if (!need) return <div className="container empty">Not found</div>;

  const pct = Math.min(100, Math.round((need.amount_funded / need.amount_required) * 100));
  const remaining = Math.max(0, need.amount_required - need.amount_funded);
  const isFull = need.amount_funded >= need.amount_required;

  const donate = async (e) => {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const { data } = await api.post("/donations", {
        need_id: id,
        amount: Number(amount),
        method,
      });
      setCelebration({ amount: data.donation.amount });
      setShowModal(false);
      setAmount("");
      load();
    } catch (err) {
      setFeedback({ type: "error", msg: err.response?.data?.error || "Donation failed" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="container">
        <Link to="/donor-dashboard/needs" className="btn btn-ghost btn-sm" style={{ margin: "20px 0" }}>
          ← Back to needs
        </Link>
        {feedback?.type === "error" && (
          <div className="banner-error" style={{ marginBottom: 20 }}>
            {feedback.msg}
          </div>
        )}

        <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
          <div>
            <div
              className="reveal"
              style={{
                width: "100%",
                height: 320,
                borderRadius: "var(--radius)",
                backgroundImage: `url(${need.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: 20,
              }}
            />
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {need.tag && <span className={needCategoryTagClass(need.tag)}>{need.tag}</span>}
              <span
                className={`tag tag-${need.status === "funded" ? "green" : need.status === "closed" ? "gray" : "blue"}`}
              >
                {need.status}
              </span>
            </div>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>{need.title}</h1>
            <p style={{ color: "var(--gray-600)", marginBottom: 24 }}>{need.description}</p>

            {need.beneficiary_name && (
              <div className="card reveal" style={{ marginBottom: 16 }}>
                <h4 style={{ color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", marginBottom: 6 }}>
                  Beneficiary
                </h4>
                <p>
                  <strong>{need.beneficiary_name}</strong>{" "}
                  {need.beneficiary_reference_code && (
                    <span style={{ color: "var(--gray-500)" }}>· Ref {need.beneficiary_reference_code}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="card reveal" style={{ position: "sticky", top: 90, transitionDelay: "80ms" }}>
              <div className="progress-row" style={{ fontSize: 14 }}>
                <strong>Rs. {need.amount_funded.toLocaleString()}</strong>
                <span>{pct}%</span>
              </div>
              <div className="progress" style={{ height: 12 }}>
                <div className={"progress-bar" + (isFull ? " full" : "")} style={{ width: pct + "%" }} />
              </div>
              <div style={{ marginTop: 10, color: "var(--gray-600)", fontSize: 14 }}>
                of <strong>Rs. {need.amount_required.toLocaleString()}</strong> goal
              </div>

              {!isFull && need.status === "pending" ? (
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  style={{ marginTop: 20 }}
                  onClick={() => setShowModal(true)}
                >
                  Donate now
                </button>
              ) : (
                <div className="banner-success" style={{ marginTop: 20, textAlign: "center" }}>
                  ✓ Fully funded
                </div>
              )}

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--gray-100)" }}>
                <h4 style={{ color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>
                  Institution
                </h4>
                <Link
                  to={`/donor-dashboard/institution/${need.institution_id}`}
                  style={{ color: "var(--primary)", fontWeight: 600 }}
                >
                  {need.institution_name}
                </Link>
                <p style={{ color: "var(--gray-500)", fontSize: 13, marginTop: 4 }}>{need.institution_location}</p>
                {need.institution_email && <p style={{ fontSize: 13, marginTop: 8 }}>📧 {need.institution_email}</p>}
                {need.institution_phone && <p style={{ fontSize: 13, marginTop: 4 }}>📞 {need.institution_phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Donate to this need</h3>
              <p className="sub">Remaining: Rs. {remaining.toLocaleString()}</p>
              <form className="form" onSubmit={donate}>
                <div className="form-row">
                  <label>Amount (Rs.)</label>
                  <input
                    type="number"
                    min="1"
                    max={remaining}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    autoFocus
                    placeholder={`Up to ${remaining}`}
                  />
                </div>
                <div className="form-row">
                  <label>Payment method</label>
                  <div className="pay-options pay-options--inline-three">
                    {PAY_METHODS.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        className={"pay-option" + (method === p.id ? " selected" : "")}
                        onClick={() => setMethod(p.id)}
                      >
                        <img className="pay-option__logo" src={p.logoSrc} alt="" decoding="async" aria-hidden />
                        <span className="pay-option__label">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" className="btn btn-secondary btn-block" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                    {busy ? "Processing…" : "Confirm donation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {celebration && (
        <div className="donation-success-root" role="dialog" aria-modal="true" aria-labelledby="donation-success-title">
          <div className="donation-success-backdrop" onClick={() => setCelebration(null)} aria-hidden />
          <div className="donation-success-center">
            <div className="donation-success-card">
              <div className="donation-success-card__sheen" aria-hidden />
              <div className="donation-success-icon" aria-hidden>
                ✓
              </div>
              <p className="donation-success-kicker" id="donation-success-title">
                Donation successful
              </p>
              <p className="donation-success-amount">Rs. {celebration.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
