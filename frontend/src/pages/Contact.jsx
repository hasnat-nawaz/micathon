export default function Contact() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Contact</h1>
        <p className="sub">We'd love to hear from institutions and donors alike.</p>
      </div>
      <div className="grid grid-2" style={{ maxWidth: 800 }}>
        <div className="card">
          <h3 style={{ color: "var(--primary)", marginBottom: 12 }}>📧 Email</h3>
          <p>hello@yaqeen.pk</p>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--gray-500)" }}>Reply within 1 business day.</p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--primary)", marginBottom: 12 }}>📞 Phone</h3>
          <p>+92 300 0000000</p>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--gray-500)" }}>Mon–Fri, 9am–6pm PKT.</p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--primary)", marginBottom: 12 }}>🏢 Become an institution</h3>
          <p>Schools, NGOs, and verified vendors can sign up to post needs. We verify before activation.</p>
        </div>
        <div className="card">
          <h3 style={{ color: "var(--primary)", marginBottom: 12 }}>🤝 Partnerships</h3>
          <p>Interested in integrating or co-launching a campaign? Reach out via email.</p>
        </div>
      </div>
    </div>
  );
}
