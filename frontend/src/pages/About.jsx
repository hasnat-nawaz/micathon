import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const FEATURES = [
  {
    icon: "🔍",
    title: "Browse Verified Needs",
    desc: "Institutions post specific, verified needs — tuition fees, grocery kits, medical aid. Every need is vetted before it appears on the platform.",
  },
  {
    icon: "💳",
    title: "Fund Directly & Securely",
    desc: "Choose a need and fund it partially or fully via card, EasyPaisa, or JazzCash. Your money goes straight to the institution, never to an individual as cash.",
  },
  {
    icon: "📊",
    title: "Track Your Impact in Real-Time",
    desc: "Watch funding progress live. See exactly how much has been raised, what percentage is complete, and when a need moves to 'funded' status.",
  },
  {
    icon: "🏫",
    title: "Institution Accountability",
    desc: "Only registered, verified institutions can post needs. They confirm service delivery and close the loop — so you know your donation was fulfilled.",
  },
  {
    icon: "🤝",
    title: "No Cash to Beneficiaries",
    desc: "Beneficiaries receive services, not money. This eliminates misuse, preserves dignity, and ensures your Zakat reaches its intended purpose.",
  },
  {
    icon: "🏆",
    title: "Donor Leaderboard & Recognition",
    desc: "See top contributors on the public leaderboard. Every donation counts toward your impact score, motivating a community of transparent givers.",
  },
];

const STEPS = [
  { num: "01", title: "Institution uploads a need", desc: "Title, amount, beneficiary reference — all verified before going live." },
  { num: "02", title: "Donor browses & funds", desc: "Partial or full funding via card, EasyPaisa, or JazzCash." },
  { num: "03", title: "Need progresses in real-time", desc: "Funded amount updates live; status changes to 'funded' when goal is met." },
  { num: "04", title: "Service delivered, loop closed", desc: "Institution confirms delivery. The beneficiary gets help, not cash." },
];

export default function About() {
  const { user } = useAuth();
  const ctaLink = user
    ? (user.role === "donor" ? "/donor-dashboard/needs" : "/institution-dashboard")
    : "/signup";

  return (
    <>
      {/* ─── Hero Header ─── */}
      <section style={{
        background: "linear-gradient(135deg, var(--dark) 0%, var(--dark-mid) 100%)",
        color: "white",
        padding: "80px 0 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 70% 30%, rgba(102,181,57,0.12), transparent 60%)",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="hero-tag" style={{ margin: "0 auto 20px", width: "fit-content" }}>
            <span style={{ fontSize: 16 }}>🌱</span>
            About Yaqeen
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Closing the Loop on<br />Directed Giving
          </h1>
          <p style={{ fontSize: 17, opacity: 0.8, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Traditional charity hands cash to individuals. Donors lose visibility,
            beneficiaries face stigma, and trust erodes. Yaqeen fixes this.
          </p>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="section" style={{ background: "white" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="tag tag-blue" style={{ marginBottom: 16, display: "inline-block" }}>Process</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--gray-900)", marginBottom: 12 }}>How Yaqeen Works</h2>
            <p style={{ color: "var(--gray-500)", maxWidth: 480, margin: "0 auto" }}>
              Four simple steps. Full transparency. Zero untracked cash.
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 24,
          }}>
            {STEPS.map((s) => (
              <div key={s.num} className="card" style={{ textAlign: "center", padding: "36px 24px" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "var(--primary-50)", color: "var(--primary)",
                  display: "grid", placeItems: "center",
                  fontSize: 20, fontWeight: 800,
                  margin: "0 auto 20px",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--gray-900)", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--gray-500)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <span className="tag tag-blue">Features</span>
            <h2>Why Choose Yaqeen?</h2>
            <p>
              Every feature is designed to maximize transparency, trust, and real-world impact.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative" }}>
          <h2>Ready to give with certainty?</h2>
          <p>Join Yaqeen today and ensure every rupee reaches where it's needed most.</p>
          <Link to={ctaLink} className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}
