import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leaderboard").then(({ data }) => setRows(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1>🏆 Top Donors</h1>
        <p className="sub">Ranked by total contributions across all needs.</p>
      </div>
      {loading ? <div className="spinner" /> : rows.length === 0 ? (
        <div className="empty"><div className="icon">🌱</div><p>No donations yet — be the first!</p></div>
      ) : (
        <table className="table slide-up">
          <thead>
            <tr><th>Rank</th><th>Donor</th><th>Donations</th><th>Total Contributed</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td><span className={`rank-badge${i < 3 ? " rank-" + (i+1) : ""}`}>{i+1}</span></td>
                <td><strong>{r.name}</strong></td>
                <td>{r.donation_count}</td>
                <td><strong style={{ color: "var(--primary)" }}>Rs. {r.total_donated.toLocaleString()}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
