import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function InstDashboard() {
  const { profile } = useAuth();
  const [me, setMe] = useState(null);
  useEffect(() => {
    api.get("/me").then(({ data }) => setMe(data));
  }, []);

  const name = profile?.name?.trim() || "Your institution";
  const meta = [profile?.type, profile?.location].filter(Boolean).join(" · ") || "Verified institution";

  return (
    <>
      <section className="dashboard-hero dashboard-hero--single dashboard-hero--institution">
        <div className="dashboard-hero__glow" aria-hidden />
        <div className="container">
          <div className="dashboard-hero__narrow">
            <div className="hero-tag">
              <span style={{ fontSize: 16 }}>🏛️</span>
              Institution dashboard
            </div>
            <h1 className="dashboard-hero__title">{name}</h1>
            <p className="dashboard-hero__lead">{meta}</p>
          </div>
        </div>
      </section>

      <section className="section inst-content-band reveal" style={{ background: "var(--gray-50)" }}>
        <div className="container">
          <div className="stats-grid stats-grid--home stats-grid--inst reveal">
            <div className="stat stat--impact slide-up reveal" style={{ transitionDelay: "0ms" }}>
              <div className="label">Total needs</div>
              <div className="value">{me?.stats?.total_needs ?? 0}</div>
            </div>
            <div className="stat stat--impact slide-up reveal" style={{ transitionDelay: "60ms" }}>
              <div className="label">Pending</div>
              <div className="value" style={{ color: "var(--primary-dark)" }}>
                {me?.stats?.pending_needs ?? 0}
              </div>
            </div>
            <div className="stat stat--impact slide-up reveal" style={{ transitionDelay: "120ms" }}>
              <div className="label">Funded</div>
              <div className="value" style={{ color: "var(--green)" }}>
                {me?.stats?.funded_needs ?? 0}
              </div>
            </div>
            <div className="stat stat--impact slide-up reveal" style={{ transitionDelay: "180ms" }}>
              <div className="label">Total raised</div>
              <div className="value">Rs. {(me?.stats?.total_raised ?? 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="inst-actions-intro">
            <span className="tag tag-blue">Quick actions</span>
            <h2>What would you like to do?</h2>
            <p>Post verified needs, track funding, and manage beneficiaries — same calm visuals as the rest of Yaqeen.</p>
          </div>
          <div className="grid grid-3 inst-action-grid">
            <Link
              to="/institution-dashboard/needs/new"
              className="inst-dash-action-card reveal"
              style={{ transitionDelay: "0ms" }}
            >
              <span className="inst-dash-action-card__icon" aria-hidden>
                ➕
              </span>
              <div className="inst-dash-action-card__title">Post a new need</div>
              <p className="inst-dash-action-card__desc">Create a verified funding request with amount, story, and optional beneficiary link.</p>
            </Link>
            <Link
              to="/institution-dashboard/needs"
              className="inst-dash-action-card reveal"
              style={{ transitionDelay: "80ms" }}
            >
              <span className="inst-dash-action-card__icon" aria-hidden>
                📋
              </span>
              <div className="inst-dash-action-card__title">Manage needs</div>
              <p className="inst-dash-action-card__desc">Review progress, mark funded or closed, and keep donors in the loop.</p>
            </Link>
            <Link
              to="/institution-dashboard/beneficiaries"
              className="inst-dash-action-card reveal"
              style={{ transitionDelay: "160ms" }}
            >
              <span className="inst-dash-action-card__icon" aria-hidden>
                👥
              </span>
              <div className="inst-dash-action-card__title">Beneficiaries</div>
              <p className="inst-dash-action-card__desc">Add people you serve and attach them to needs when appropriate.</p>
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link to="/institution-dashboard/profile" className="btn btn-secondary btn-sm">
              Institution profile →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
