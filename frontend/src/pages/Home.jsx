import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import NeedCard from "../components/NeedCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [stats, setStats] = useState({ raised: 0, donors: 0, needs: 0 });

  useEffect(() => {
    api.get("/needs").then(({ data }) => {
      setNeeds(data.slice(0, 6));
      const raised = data.reduce((s, n) => s + (n.amount_funded || 0), 0);
      setStats({ raised, donors: 0, needs: data.length });
    }).catch(() => {});
    api.get("/leaderboard").then(({ data }) => {
      setStats((s) => ({ ...s, donors: data.filter((d) => d.total_donated > 0).length }));
    }).catch(() => {});
  }, []);

  const ctaLink = user
    ? (user.role === "donor" ? "/donor-dashboard/needs" : "/institution-dashboard")
    : "/signup";

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Give directly. Give transparently.</h1>
          <p>The Equivalence Engine connects donors to verified needs from trusted institutions — schools, NGOs, vendors. No cash to individuals. Every rupee tracked.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to={ctaLink} className="btn btn-primary btn-lg">Browse Needs</Link>
            <Link to="/about" className="btn btn-secondary btn-lg">How it Works</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-grid" style={{ marginBottom: 48 }}>
            <div className="stat slide-up">
              <div className="label">Total raised</div>
              <div className="value">Rs. {stats.raised.toLocaleString()}</div>
            </div>
            <div className="stat slide-up">
              <div className="label">Active needs</div>
              <div className="value">{stats.needs}</div>
            </div>
            <div className="stat slide-up">
              <div className="label">Active donors</div>
              <div className="value">{stats.donors}</div>
            </div>
          </div>

          <div className="section-head">
            <div>
              <h2>Featured Needs</h2>
              <p>Verified by trusted institutions. Fund what matters.</p>
            </div>
            <Link to={user?.role === "donor" ? "/donor-dashboard/needs" : "/signup"} className="btn btn-secondary btn-sm">View all →</Link>
          </div>

          {needs.length === 0 ? (
            <div className="empty"><div className="icon">📋</div><p>No needs yet — check back soon.</p></div>
          ) : (
            <div className="grid grid-3">
              {needs.map((n) => <NeedCard key={n.id} need={n} linkBase={user?.role === "donor" ? "/donor-dashboard/need" : "/login"} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
