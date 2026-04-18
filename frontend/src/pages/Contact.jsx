const CONTACT_CARDS = [
  {
    icon: "📧",
    title: "Email",
    lines: ["hello@yaqeen.pk", "Reply within 1 business day."],
  },
  {
    icon: "📞",
    title: "Phone",
    lines: ["+92 300 0000000", "Mon–Fri, 9am–6pm PKT."],
  },
  {
    icon: "🏢",
    title: "Become an institution",
    lines: [
      "Schools, NGOs, and verified vendors can sign up to post needs. We verify before activation.",
    ],
  },
  {
    icon: "🤝",
    title: "Partnerships",
    lines: [
      "Interested in integrating or co-launching a campaign? Reach out via email.",
    ],
  },
];

export default function Contact() {
  return (
    <>
      <section className="page-hero-about page-hero-about--contact">
        <div className="page-hero-about__glow" aria-hidden />
        <div className="container page-hero-about__inner">
          <div className="hero-tag">
            <span style={{ fontSize: 16 }}>💬</span>
            Get in touch
          </div>
          <h1 className="page-hero-about__title">Contact us</h1>
          <p className="page-hero-about__lead">
            We&apos;d love to hear from institutions and donors alike.
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <span className="tag tag-blue">Reach us</span>
            <h2>Ways to connect</h2>
            <p>Choose what fits you — we respond to every serious inquiry.</p>
          </div>
          <div className="features-grid">
            {CONTACT_CARDS.map((c) => (
              <div className="feature-card" key={c.title}>
                <div className="feature-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>
                  <span style={{ color: "var(--gray-800)", fontWeight: 600 }}>{c.lines[0]}</span>
                  {c.lines[1] && (
                    <>
                      <br />
                      <span style={{ color: "var(--gray-500)", fontSize: 14 }}>{c.lines[1]}</span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
