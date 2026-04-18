import { useEffect, useState } from "react";
import api from "../../api/client.js";

export default function DonorProfile() {
  const [me, setMe] = useState(null);
  useEffect(() => { api.get("/me").then(({ data }) => setMe(data)); }, []);
  if (!me) return <div className="container"><div className="spinner" /></div>;

  return (
    <>
      <section className="page-hero-about page-hero-about--profile">
        <div className="page-hero-about__glow" aria-hidden />
        <div className="container page-hero-about__inner">
          <div className="hero-tag">
            <span style={{ fontSize: 16 }}>👤</span>
            My profile
          </div>
          <h1 className="page-hero-about__title">My Profile</h1>
          <p className="page-hero-about__lead">
            A clean snapshot of your account details<br />
            and your impact so far.
          </p>
        </div>
      </section>

      <section className="section reveal" style={{ background: "var(--gray-50)" }}>
        <div className="container">
          <div className="grid grid-2 profile-grid">
            <div className="card profile-card card-hover reveal">
              <div className="profile-card__surface">
                <div className="profile-card__top">
                  <div className="profile-card__name">{me.profile.name}</div>
                  <div className="profile-card__handle">@{me.user.username}</div>
                </div>
                <div className="profile-card__details">
                  <div className="profile-card__detail">{me.profile.email || "—"}</div>
                  <div className="profile-card__detail">{me.profile.phone || "—"}</div>
                </div>
                <div className="profile-card__member-since">
                  Member since {new Date(me.user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="card card-hover profile-impact-card reveal" style={{ transitionDelay: "80ms" }}>
              <div className="profile-impact-card__surface">
                <div className="profile-impact-card__kicker">Impact</div>
                <div className="profile-impact-card__value">
                  Rs. {me.stats.total_donated.toLocaleString()}
                </div>
                <div className="profile-impact-card__sub">
                  across {me.stats.donation_count} donation{me.stats.donation_count === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </div>

          {me.donations.length > 0 && (
            <div className="profile-history reveal" style={{ transitionDelay: "120ms" }}>
              <div className="section-head section-head--center">
                <div>
                  <h2>Donation history</h2>
                  <p>Verified records of the needs you funded.</p>
                </div>
              </div>
              <table className="table profile-donation-table reveal" style={{ transitionDelay: "180ms" }}>
                <thead>
                  <tr>
                    <th>Need</th>
                    <th>Institution</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
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
            </div>
          )}
        </div>
      </section>
    </>
  );
}
