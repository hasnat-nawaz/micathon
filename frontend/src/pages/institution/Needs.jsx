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
    api.get("/needs", { params: { institution_id: profile.id } })
      .then(({ data }) => setNeeds(data))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [profile?.id]);

  const updateStatus = async (id, status) => {
    await api.patch(`/needs/${id}/status`, { status });
    load();
  };

  return (
    <div className="container">
      <div className="page-header reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Manage Needs</h1>
          <p className="sub">All needs posted by your institution.</p>
        </div>
        <Link to="/institution-dashboard/needs/new" className="btn btn-primary">+ New need</Link>
      </div>

      {loading ? <div className="spinner" /> : needs.length === 0 ? (
        <div className="empty"><div className="icon">📋</div><p>No needs yet.</p><Link to="/institution-dashboard/needs/new" className="btn btn-primary" style={{ marginTop: 16 }}>Create your first</Link></div>
      ) : (
        <table className="table reveal">
          <thead><tr><th>Title</th><th>Funded</th><th>Goal</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {needs.map((n) => {
              const pct = Math.min(100, Math.round((n.amount_funded / n.amount_required) * 100));
              return (
                <tr key={n.id}>
                  <td><strong>{n.title}</strong>{n.tag && <span className="tag tag-blue" style={{ marginLeft: 8 }}>{n.tag}</span>}</td>
                  <td>Rs. {n.amount_funded.toLocaleString()} ({pct}%)</td>
                  <td>Rs. {n.amount_required.toLocaleString()}</td>
                  <td><span className={`tag tag-${n.status === "funded" ? "green" : n.status === "closed" ? "gray" : "blue"}`}>{n.status}</span></td>
                  <td>
                    {n.status === "funded" && (
                      <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(n.id, "closed")}>Mark closed</button>
                    )}
                    {n.status === "pending" && n.amount_funded >= n.amount_required && (
                      <button className="btn btn-sm btn-primary" onClick={() => updateStatus(n.id, "funded")}>Mark funded</button>
                    )}
                    {n.status === "closed" && <span style={{ color: "var(--gray-400)", fontSize: 13 }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
