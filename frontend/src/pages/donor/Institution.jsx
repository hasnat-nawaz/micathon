import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/client.js";
import NeedCard from "../../components/NeedCard.jsx";

export default function Institution() {
  const { id } = useParams();
  const [inst, setInst] = useState(null);

  useEffect(() => {
    api.get(`/institutions/${id}`).then(({ data }) => setInst(data));
  }, [id]);

  if (!inst) return <div className="container"><div className="spinner" /></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>{inst.name} {inst.is_verified && <span className="tag tag-green" style={{ fontSize: 12, verticalAlign: "middle" }}>✓ Verified</span>}</h1>
        <p className="sub">{inst.type} · {inst.location}</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat"><div className="label">Total needs</div><div className="value">{inst.stats.total_needs}</div></div>
        <div className="stat"><div className="label">Total raised</div><div className="value">Rs. {inst.stats.total_raised.toLocaleString()}</div></div>
        <div className="stat"><div className="label">Funded needs</div><div className="value">{inst.stats.funded_count}</div></div>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <h3 style={{ color: "var(--gray-500)", fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>Contact</h3>
        {inst.contact_email && <p>📧 {inst.contact_email}</p>}
        {inst.contact_phone && <p style={{ marginTop: 4 }}>📞 {inst.contact_phone}</p>}
      </div>

      <div className="section-head"><div><h2>Needs from this institution</h2></div></div>
      {inst.needs.length === 0 ? (
        <div className="empty"><p>No needs posted yet.</p></div>
      ) : (
        <div className="grid grid-3">
          {inst.needs.map((n) => <NeedCard key={n.id} need={{ ...n, institution_name: inst.name, institution_location: inst.location }} />)}
        </div>
      )}
    </div>
  );
}
