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
        <p className="sub">Donor account details and giving history.</p>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>Account</h3>
          <p><strong>Name:</strong> {me.profile.name}</p>
          <p style={{ marginTop: 6 }}><strong>Username:</strong> {me.user.username}</p>
          <p style={{ marginTop: 6 }}><strong>Email:</strong> {me.profile.email || "—"}</p>
          <p style={{ marginTop: 6 }}><strong>Phone:</strong> {me.profile.phone || "—"}</p>
          <p style={{ marginTop: 6, color: "var(--gray-500)", fontSize: 13 }}>Member since {new Date(me.user.created_at).toLocaleDateString()}</p>
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
