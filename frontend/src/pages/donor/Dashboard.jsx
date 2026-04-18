import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import NeedCard from "../../components/NeedCard.jsx";
import { computeDonationStreak } from "../../utils/donationStreak.js";

export default function DonorDashboard() {
  const { profile } = useAuth();
  const [me, setMe] = useState(null);
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    api.get("/me").then(({ data }) => setMe(data));
    api.get("/needs", { params: { status: "pending" } }).then(({ data }) => setNeeds(data.slice(0, 6)));
  }, []);

  const streak = useMemo(() => (me ? computeDonationStreak(me.donations || []) : null), [me]);

  const displayName = profile?.name?.trim() || "Donor";

  return (
    <>
      <section className="dashboard-hero dashboard-hero--donor">
        <div className="dashboard-hero__glow" aria-hidden />
        <div className="container dashboard-hero__container">
          <div className="dashboard-hero__row">
            <div className="dashboard-hero__left">
              <div className="hero-tag dashboard-hero__pill">
                <span style={{ fontSize: 16 }}>🌱</span>
                Donor dashboard
              </div>
              <h1 className="dashboard-hero__name">{displayName}</h1>
              <p className="dashboard-hero__subline">
                Your streak, open needs, and giving history —
                <br />
                together in one calm view.
              </p>
            </div>
            <div className="dashboard-streak-glass reveal">
              <div className="dashboard-streak-glass__label">Donation streak</div>
              <div className="dashboard-streak-glass__value">{streak === null ? "…" : streak}</div>
              <div className="dashboard-streak-glass__unit">days in a row</div>
              {me && streak === 0 && (
                <p className="dashboard-streak-glass__hint">
                  Donate on consecutive days to grow your streak.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="section-head dashboard-needs-head">
            <div className="dashboard-needs-head__text">
              <h2>Needs you can fund</h2>
              <p>
                Live, verified requests from partner institutions — pick one that speaks to you and fund it in a few
                clicks.
              </p>
            </div>
            <Link to="/donor-dashboard/needs" className="btn btn-secondary btn-sm">
              Browse all →
            </Link>
          </div>
          {needs.length === 0 ? (
            <div className="empty">
              <div className="icon">🎉</div>
              <p>All current needs are fully funded!</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {needs.map((n, i) => (
                <NeedCard key={n.id} need={n} staggerIndex={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {me?.donations?.length > 0 && (
        <section className="features-section reveal">
          <div className="container">
            <div className="features-header">
              <span className="tag tag-blue">Activity</span>
              <h2>Your donations</h2>
              <p>
                A running list of completed gifts — each row is a verified need you supported, with the amount
                and date kept transparent and easy to read.
              </p>
            </div>
            <div className="donation-activity-panel reveal">
              <div className="donation-activity-list">
              {me.donations.map((d, i) => (
                <article
                  className="donation-row reveal"
                  key={d.id}
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  <div className="donation-row__accent" aria-hidden />
                  <div className="donation-row__body">
                    <div className="donation-row__main">
                      <span className="donation-row__kicker">Funded need</span>
                      <span className="donation-row__title">{d.need_title || "Verified need"}</span>
                      <span className="donation-row__inst">{d.institution_name || "—"}</span>
                    </div>
                    <div className="donation-row__meta">
                      <span className="donation-row__amount">Rs. {d.amount.toLocaleString()}</span>
                      <time className="donation-row__date" dateTime={d.created_at}>
                        {new Date(d.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
