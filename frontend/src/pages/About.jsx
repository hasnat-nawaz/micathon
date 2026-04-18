export default function About() {
  return (
    <div className="container">
      <div className="page-header">
        <h1>About The Equivalence Engine</h1>
        <p className="sub">Closing the loop on directed giving.</p>
      </div>
      <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 8, color: "var(--blue)" }}>The problem</h3>
          <p>Traditional charity often hands cash to individuals. Donors lose visibility, beneficiaries face stigma, and trust erodes when funds are misused.</p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 8, color: "var(--blue)" }}>Our model</h3>
          <p>We never transfer money to beneficiaries. Verified institutions (schools, NGOs, vendors) post specific needs — fees, groceries, supplies. Donors fund those needs. Institutions confirm fulfillment. The beneficiary receives the service, not cash.</p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 8, color: "var(--blue)" }}>How it works</h3>
          <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Institution uploads a need</strong> — title, amount, beneficiary reference.</li>
            <li><strong>Donor browses & funds</strong> — partial or full, via card / EasyPaisa / JazzCash.</li>
            <li><strong>Need progresses</strong> — funded amount updates in real time; status changes to <em>funded</em> when goal is met.</li>
            <li><strong>Institution closes the need</strong> — service delivered, loop closed.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
