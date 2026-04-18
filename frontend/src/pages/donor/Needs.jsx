import { useEffect, useState } from "react";
import api from "../../api/client.js";
import NeedCard from "../../components/NeedCard.jsx";

const TAGS = ["all", "urgent", "education", "food", "health"];

export default function DonorNeeds() {
  const [needs, setNeeds] = useState([]);
  const [tag, setTag] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = tag === "all" ? {} : { tag };
    api.get("/needs", { params }).then(({ data }) => setNeeds(data)).finally(() => setLoading(false));
  }, [tag]);

  return (
    <>
      <section className="dashboard-hero dashboard-hero--single">
        <div className="dashboard-hero__glow" aria-hidden />
        <div className="container">
          <div className="dashboard-hero__narrow">
            <h1 className="dashboard-hero__title">Browse needs</h1>
            <p className="dashboard-hero__lead">
              Filter by category and fund what matters most — verified needs from trusted institutions.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="filter-bar">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                className={"filter-chip" + (tag === t ? " active" : "")}
                onClick={() => setTag(t)}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner" />
          ) : needs.length === 0 ? (
            <div className="empty">
              <div className="icon">📭</div>
              <p>No needs match this filter.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {needs.map((n, i) => (
                <NeedCard key={`${tag}-${n.id}`} need={n} staggerIndex={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
