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
    <>
      <section className="page-hero-about page-hero-about--profile page-hero-about--institution">
        <div className="page-hero-about__glow" aria-hidden />
        <div className="container page-hero-about__inner">
          <div className="hero-tag">
            <span style={{ fontSize: 16 }}>🏛️</span>
            Institution profile
          </div>
          <h1 className="page-hero-about__title">My Profile</h1>
          <p className="page-hero-about__lead">
            Your institution details and contact info — aligned with the rest of Yaqeen: dark hero band, soft mint
            surfaces, and green-accented cards.
          </p>
        </div>
      </section>

      <section className="section reveal" style={{ background: "var(--gray-50)" }}>
        <div className="container">
          <div className="grid grid-2 profile-grid">
            <div className="card profile-card card-hover reveal">
              <div className="profile-card__surface">
                <div className="profile-card__top">
                  <div className="profile-card__name">{p?.name || "—"}</div>
                  <div className="profile-card__handle">@{me.user.username}</div>
                </div>
                <div className="profile-card__details">
                  <div className="profile-card__detail">{p?.contact_email || "—"}</div>
                  <div className="profile-card__detail">{p?.contact_phone || "—"}</div>
                  <div className="profile-card__detail">
                    {[p?.type, p?.location].filter(Boolean).join(" · ") || "—"}
                  </div>
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
                  Rs. {(me.stats?.total_raised ?? 0).toLocaleString()}
                </div>
                <div className="profile-impact-card__sub">
                  {me.stats?.total_needs ?? 0} need{(me.stats?.total_needs ?? 0) === 1 ? "" : "s"} posted
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
