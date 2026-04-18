import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import NeedCard from "../../components/NeedCard.jsx";

export default function DonorDashboard() {
  const { profile } = useAuth();
  const [me, setMe] = useState(null);
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    api.get("/me").then(({ data }) => setMe(data));
    api.get("/needs", { params: { status: "pending" } }).then(({ data }) => setNeeds(data.slice(0, 6)));
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Welcome, {profile?.name || "Donor"} 👋</h1>
        <p className="sub">Your impact at a glance.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 40 }}>
        <div className="stat slide-up">
          <div className="label">Total donated</div>
          <div className="value">Rs. {(me?.stats?.total_donated || 0).toLocaleString()}</div>
        </div>
        <div className="stat slide-up">
          <div className="label">Donations made</div>
          <div className="value">{me?.stats?.donation_count || 0}</div>
        </div>
        <div className="stat slide-up">
          <div className="label">Status</div>
          <div className="value" style={{ fontSize: 20, color: "var(--green)" }}>Active</div>
        </div>
      </div>

      <div className="section-head">
        <div><h2>Needs you can fund</h2><p>Pending and verified.</p></div>
        <Link to="/donor-dashboard/needs" className="btn btn-secondary btn-sm">Browse all →</Link>
      </div>
      {needs.length === 0 ? (
        <div className="empty"><div className="icon">🎉</div><p>All current needs are fully funded!</p></div>
      ) : (
        <div className="grid grid-3">
          {needs.map((n) => <NeedCard key={n.id} need={n} />)}
        </div>
      )}

      {me?.donations?.length > 0 && (
        <>
          <div className="section-head" style={{ marginTop: 48 }}>
            <div><h2>Recent donations</h2></div>
          </div>
          <table className="table">
            <thead><tr><th>Need</th><th>Institution</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {me.donations.map((d) => (
                <tr key={d.id}>
                  <td>{d.need_title}</td>
                  <td>{d.institution_name}</td>
                  <td><strong>Rs. {d.amount.toLocaleString()}</strong></td>
                  <td>{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
