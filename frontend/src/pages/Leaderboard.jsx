import { useEffect, useState } from "react";
import api from "../api/client.js";

function RankBadge({ index }) {
  const n = index + 1;
  if (n === 1) {
    return (
      <span className="leaderboard-rank leaderboard-rank--1" title="1st place">
        <span className="leaderboard-rank__inner">{n}</span>
      </span>
    );
  }
  if (n === 2) {
    return (
      <span className="leaderboard-rank leaderboard-rank--2" title="2nd place">
        <span className="leaderboard-rank__inner">{n}</span>
      </span>
    );
  }
  if (n === 3) {
    return (
      <span className="leaderboard-rank leaderboard-rank--3" title="3rd place">
        <span className="leaderboard-rank__inner">{n}</span>
      </span>
    );
  }
  return (
    <span className="leaderboard-rank leaderboard-rank--rest">
      {n}
    </span>
  );
}

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leaderboard").then(({ data }) => setRows(data)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero-about page-hero-about--leaderboard">
        <div className="page-hero-about__glow" aria-hidden />
        <div className="container page-hero-about__inner">
          <div className="hero-tag">
            <span style={{ fontSize: 16 }}>🏆</span>
            Community impact
          </div>
          <h1 className="page-hero-about__title">Leaderboard</h1>
          <p className="page-hero-about__lead">
            Celebrating donors who give with Yaqeen — ranked by total contributions across all verified needs.
          </p>
        </div>
      </section>

      <section className="section leaderboard-section">
        <div className="container">
          {loading ? (
            <div className="spinner" />
          ) : rows.length === 0 ? (
            <div className="empty">
              <div className="icon">🌱</div>
              <p>No donations yet — be the first!</p>
            </div>
          ) : (
            <div className="leaderboard-panel">
              <div className="leaderboard-panel__inner">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th scope="col">Rank</th>
                      <th scope="col">Donor</th>
                      <th scope="col">Donations</th>
                      <th scope="col" className="leaderboard-table__amount-head">
                        Total contributed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, index) => (
                      <tr key={r.id} className="leaderboard-row">
                        <td>
                          <RankBadge index={index} />
                        </td>
                        <td>
                          <span className="leaderboard-donor">{r.name}</span>
                        </td>
                        <td>
                          <span className="leaderboard-count">{r.donation_count}</span>
                        </td>
                        <td>
                          <span className="leaderboard-amount">
                            Rs. {r.total_donated.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
