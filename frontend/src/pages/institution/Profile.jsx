import { useEffect, useState } from "react";
import api from "../../api/client.js";

export default function InstitutionProfile() {
  const [me, setMe] = useState(null);
  useEffect(() => {
    api.get("/me").then(({ data }) => setMe(data));
  }, []);
  if (!me) return <div className="container"><div className="spinner" /></div>;

  const p = me.profile;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Your profile</h1>
      </div>
      <div className="grid grid-2">
        <div className="card profile-card">
          <div className="profile-card__top">
            <div className="profile-card__name">{p?.name || "—"}</div>
            <div className="profile-card__handle">{me.user.username}</div>
          </div>
          <div className="profile-card__details">
            <div className="profile-card__detail">{p?.contact_email || "—"}</div>
            <div className="profile-card__detail">{p?.contact_phone || "—"}</div>
            <div className="profile-card__detail">{[p?.type, p?.location].filter(Boolean).join(" · ") || "—"}</div>
          </div>
          <div className="profile-card__member-since">
            Member since {new Date(me.user.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>Impact</h3>
          <p style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>
            Rs. {(me.stats?.total_raised ?? 0).toLocaleString()}
          </p>
          <p style={{ color: "var(--gray-500)" }}>
            {me.stats?.total_needs ?? 0} need{(me.stats?.total_needs ?? 0) === 1 ? "" : "s"} posted
          </p>
        </div>
      </div>
    </div>
  );
}
