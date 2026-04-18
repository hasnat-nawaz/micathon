import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function InstNeeds() {
  const { profile } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!profile?.id) return;
    setLoading(true);
    api
      .get("/needs", { params: { institution_id: profile.id } })
      .then(({ data }) => setNeeds(data))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, [profile?.id]);

  const updateStatus = async (id, status) => {
    await api.patch(`/needs/${id}/status`, { status });
    load();
  };

  return (
    <>
      <section className="dashboard-hero dashboard-hero--single dashboard-hero--institution">
        <div className="dashboard-hero__glow" aria-hidden />
        <div className="container">
          <div className="dashboard-hero__narrow">
            <div className="hero-tag">
              <span style={{ fontSize: 16 }}>📋</span>
              Needs
            </div>
            <h1 className="dashboard-hero__title">Manage needs</h1>
            <p className="dashboard-hero__lead">All funding requests posted by your institution — progress, status, and actions in one view.</p>
          </div>
        </div>
      </section>

      <section className="section inst-content-band reveal" style={{ background: "var(--gray-50)" }}>
        <div className="container">
          <div className="inst-toolbar reveal">
            <div className="inst-toolbar__text">
              <h2>Your listings</h2>
              <p>Update status when goals are met or when delivery is complete.</p>
            </div>
            <Link to="/institution-dashboard/needs/new" className="btn btn-primary">
              + New need
            </Link>
          </div>

          {loading ? (
            <div className="spinner" style={{ margin: "32px auto" }} />
          ) : needs.length === 0 ? (
            <div className="inst-panel inst-panel--padded reveal empty" style={{ textAlign: "center", padding: "48px 24px" }}>
              <div className="icon" style={{ fontSize: 40 }}>
                📋
              </div>
              <p style={{ marginTop: 12, color: "var(--gray-600)" }}>No needs yet.</p>
              <Link to="/institution-dashboard/needs/new" className="btn btn-primary" style={{ marginTop: 20 }}>
                Create your first
              </Link>
            </div>
          ) : (
            <div className="inst-panel reveal">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Funded</th>
                    <th>Goal</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {needs.map((n) => {
                    const pct = Math.min(100, Math.round((n.amount_funded / n.amount_required) * 100));
                    return (
                      <tr key={n.id}>
                        <td>
                          <strong>{n.title}</strong>
                          {n.tag && (
                            <span className="tag tag-blue" style={{ marginLeft: 8 }}>
                              {n.tag}
                            </span>
                          )}
                        </td>
                        <td>
                          Rs. {n.amount_funded.toLocaleString()} ({pct}%)
                        </td>
                        <td>Rs. {n.amount_required.toLocaleString()}</td>
                        <td>
                          <span className={`tag tag-${n.status === "funded" ? "green" : n.status === "closed" ? "gray" : "blue"}`}>{n.status}</span>
                        </td>
                        <td>
                          {n.status === "funded" && (
                            <button type="button" className="btn btn-sm btn-secondary" onClick={() => updateStatus(n.id, "closed")}>
                              Mark closed
                            </button>
                          )}
                          {n.status === "pending" && n.amount_funded >= n.amount_required && (
                            <button type="button" className="btn btn-sm btn-primary" onClick={() => updateStatus(n.id, "funded")}>
                              Mark funded
                            </button>
                          )}
                          {n.status === "closed" && (
                            <span style={{ color: "var(--gray-400)", fontSize: 13 }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
