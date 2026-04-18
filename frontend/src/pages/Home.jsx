import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import NeedCard from "../components/NeedCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import heroBg from "../assets/pict_large.jpg";

const IMPACT_MAP = [
  { max: 500,   text: "Clean drinking water for a family for 1 week" },
  { max: 1000,  text: "School supplies for 2 children for a month" },
  { max: 2000,  text: "1 month of schooling for one child" },
  { max: 3500,  text: "A full grocery kit for a family of 4" },
  { max: 5000,  text: "Emergency medical aid for one patient" },
  { max: 7500,  text: "Vocational training for a young adult" },
  { max: 10000, text: "3 months of tuition + books for a student" },
  { max: 15000, text: "Complete winter relief package for a family" },
  { max: 20000, text: "6 months of education for 2 children" },
  { max: Infinity, text: "A life-changing transformation for an entire family" },
];

function getImpact(amount) {
  return IMPACT_MAP.find((m) => amount <= m.max)?.text || IMPACT_MAP[IMPACT_MAP.length - 1].text;
}

/** Static logos in /public/partners — infinite belt scroll on home */
const PARTNER_LOGOS = [
  "/partners/logo-leaf.png",
  "/partners/logo-humanitarian.png",
  "/partners/logo-hands.png",
  "/partners/logo-growth.png",
  "/partners/edhi.png",
  "/partners/logo-emblem.png",
  "/partners/indus-hospital.png",
  "/partners/alkhidmat.png",
  "/partners/utility-stores.png",
];

export default function Home() {
  const { user } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [stats, setStats] = useState({ raised: 0, donors: 0, needs: 0 });
  const [sliderVal, setSliderVal] = useState(2000);

  useEffect(() => {
    api.get("/needs").then(({ data }) => {
      setNeeds(data.slice(0, 6));
      const raised = data.reduce((s, n) => s + (n.amount_funded || 0), 0);
      setStats({ raised, donors: 0, needs: data.length });
    }).catch(() => {});
    api.get("/leaderboard").then(({ data }) => {
      const donors = Array.isArray(data)
        ? data.filter((d) => Number(d?.total_donated ?? 0) > 0).length || data.length
        : 0;
      setStats((s) => ({ ...s, donors }));
    }).catch(() => {});
  }, []);

  const ctaLink = user
    ? (user.role === "donor" ? "/donor-dashboard/needs" : "/institution-dashboard")
    : "/signup";

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-tag">
                <span style={{ fontSize: 16 }}>🌱</span>
                Trusted by verified institutions across Pakistan
              </div>
              <h1>
                Give with <span className="highlight">Certainty.</span><br />
                Change with <span className="highlight">Yaqeen.</span>
              </h1>
              <p>
                Every rupee you give reaches a real classroom, a real meal, or a real family.
                No cash handed out — every contribution is accounted for and verified.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to={ctaLink} className="btn btn-primary btn-lg">
                  Fund a Verified Need
                </Link>
                <Link to="/about" className="btn btn-secondary btn-lg">
                  How It Works
                </Link>
              </div>
            </div>

            <div className="impact-slider-card slide-up">
              <h3>Slide to see your impact</h3>
              <p className="slider-label">Discover what your donation can do</p>
              <div className="impact-slider-amount">
                <span>PKR </span>{sliderVal.toLocaleString()}
              </div>
              <input
                type="range"
                className="impact-slider-input"
                min={100}
                max={25000}
                step={100}
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
              />
              <div className="impact-slider-scale">
                <span>PKR 100</span>
                <span>PKR 25,000</span>
              </div>
              <div className="impact-result">
                <div className="equals">This equals</div>
                <div className="impact-text">{getImpact(sliderVal)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Partner logos (infinite scroll belt) ─── */}
      <section className="trust-bar reveal" aria-labelledby="trust-bar-heading">
        <div className="container">
          <p id="trust-bar-heading" className="trust-bar-label">
            Trusted partners & verified institutions
          </p>
        </div>
        <div
          className="trust-marquee"
          role="region"
          aria-label="Scrolling partner and institution logos"
        >
          <div className="trust-marquee__viewport">
            <div className="trust-marquee__track">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => (
                <div className="trust-marquee__item" key={`${src}-${i}`}>
                  <img
                    className="trust-marquee__logo"
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="visually-hidden">
          Partner logos include Edhi Foundation, Indus Hospital, Alkhidmat, Utility Stores, and others.
        </span>
      </section>

      {/* ─── Stats (dark band + glass cards) ─── */}
      <section className="home-metrics-band reveal" aria-label="Platform metrics">
        <div className="container">
          <div className="stats-grid stats-grid--home" style={{ marginBottom: 56 }}>
            <div className="stat stat--impact slide-up">
              <div className="label">Total raised</div>
              <div className="value">Rs. {stats.raised.toLocaleString()}</div>
            </div>
            <div className="stat stat--impact slide-up">
              <div className="label">Active needs</div>
              <div className="value">{stats.needs}</div>
            </div>
            <div className="stat stat--impact slide-up">
              <div className="label">Active donors</div>
              <div className="value">{stats.donors}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Needs ─── */}
      <section className="section section--after-metrics reveal">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Featured Needs</h2>
              <p>Verified by trusted institutions. Fund what matters.</p>
            </div>
            <Link
              to={user?.role === "donor" ? "/donor-dashboard/needs" : "/signup"}
              className="btn btn-secondary btn-sm"
            >
              View all →
            </Link>
          </div>

          {needs.length === 0 ? (
            <div className="empty">
              <div className="icon">📋</div>
              <p>No needs yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {needs.map((n) => (
                <NeedCard
                  key={n.id}
                  need={n}
                  linkBase={user?.role === "donor" ? "/donor-dashboard/need" : "/login"}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="cta-section reveal">
        <div className="container" style={{ position: "relative" }}>
          <h2>Ready to make a difference?</h2>
          <p>Join thousands of donors creating real, measurable impact across Pakistan.</p>
          <Link to={ctaLink} className="btn btn-primary btn-lg">
            Start Giving Today
          </Link>
        </div>
      </section>
    </>
  );
}
