import { useEffect, useState } from "react";
import api from "../../api/client.js";

export default function DonorProfile() {
  const [me, setMe] = useState(null);
  useEffect(() => { api.get("/me").then(({ data }) => setMe(data)); }, []);
  if (!me) return <div className="container"><div className="spinner" /></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Your Profile</h1>
      </div>
      <div className="grid grid-2">
        <div className="card profile-card">
          <div className="profile-card__top">
            <div className="profile-card__name">{me.profile.name}</div>
            <div className="profile-card__handle">{me.user.username}</div>
          </div>
          <div className="profile-card__details">
            <div className="profile-card__detail">{me.profile.email || "—"}</div>
            <div className="profile-card__detail">{me.profile.phone || "—"}</div>
          </div>
          <div className="profile-card__member-since">
            Member since {new Date(me.user.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>Impact</h3>
          <p style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>Rs. {me.stats.total_donated.toLocaleString()}</p>
          <p style={{ color: "var(--gray-500)" }}>across {me.stats.donation_count} donation{me.stats.donation_count === 1 ? "" : "s"}</p>
        </div>
      </div>

      {me.donations.length > 0 && (
        <>
          <div className="section-head" style={{ marginTop: 32 }}><div><h2>Donation history</h2></div></div>
          <table className="table">
            <thead><tr><th>Need</th><th>Institution</th><th>Method</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {me.donations.map((d) => (
                <tr key={d.id}>
                  <td>{d.need_title}</td>
                  <td>{d.institution_name}</td>
                  <td style={{ textTransform: "capitalize" }}>{d.method || "card"}</td>
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
