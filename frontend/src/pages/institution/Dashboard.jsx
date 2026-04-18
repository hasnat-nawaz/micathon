import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function InstDashboard() {
  const { profile } = useAuth();
  const [me, setMe] = useState(null);
  useEffect(() => { api.get("/me").then(({ data }) => setMe(data)); }, []);

  return (
    <div className="container">
      <div className="page-header reveal">
        <h1>{profile?.name || "Institution"} 🏫</h1>
        <p className="sub">{profile?.type} · {profile?.location}</p>
      </div>

      <div className="stats-grid reveal" style={{ marginBottom: 32 }}>
        <div className="stat reveal" style={{ transitionDelay: "0ms" }}><div className="label">Total needs</div><div className="value">{me?.stats?.total_needs ?? 0}</div></div>
        <div className="stat reveal" style={{ transitionDelay: "60ms" }}><div className="label">Pending</div><div className="value" style={{ color: "var(--primary)" }}>{me?.stats?.pending_needs ?? 0}</div></div>
        <div className="stat reveal" style={{ transitionDelay: "120ms" }}><div className="label">Funded</div><div className="value" style={{ color: "var(--green)" }}>{me?.stats?.funded_needs ?? 0}</div></div>
        <div className="stat reveal" style={{ transitionDelay: "180ms" }}><div className="label">Total raised</div><div className="value">Rs. {(me?.stats?.total_raised ?? 0).toLocaleString()}</div></div>
      </div>

      <div className="grid grid-2">
        <Link
          to="/institution-dashboard/needs/new"
          className="card card-hover reveal"
          style={{ textAlign: "center", padding: 32, transitionDelay: "0ms" }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>➕</div>
          <h3 style={{ color: "var(--primary)" }}>Post a new need</h3>
          <p style={{ color: "var(--gray-500)", marginTop: 6 }}>Create a verified funding request.</p>
        </Link>
        <Link
          to="/institution-dashboard/needs"
          className="card card-hover reveal"
          style={{ textAlign: "center", padding: 32, transitionDelay: "80ms" }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
          <h3 style={{ color: "var(--primary)" }}>Manage needs</h3>
          <p style={{ color: "var(--gray-500)", marginTop: 6 }}>Update status, edit, close out.</p>
        </Link>
        <Link
          to="/institution-dashboard/beneficiaries"
          className="card card-hover reveal"
          style={{ textAlign: "center", padding: 32, transitionDelay: "160ms" }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
          <h3 style={{ color: "var(--primary)" }}>Beneficiaries</h3>
          <p style={{ color: "var(--gray-500)", marginTop: 6 }}>Add and link to needs.</p>
        </Link>
      </div>
    </div>
  );
}
