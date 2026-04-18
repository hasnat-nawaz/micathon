import { Link } from "react-router-dom";
import { needCategoryTagClass } from "../utils/needTagClass.js";

const statusClass = {
  pending: "tag tag-blue",
  funded: "tag tag-green",
  closed: "tag tag-gray",
};

export default function NeedCard({ need, linkBase = "/donor-dashboard/need", staggerIndex }) {
  const pct = Math.min(100, Math.round((need.amount_funded / need.amount_required) * 100));
  const isFull = need.amount_funded >= need.amount_required;
  return (
    <Link
      to={`${linkBase}/${need.id}`}
      className="card card-hover need-card reveal"
      style={staggerIndex != null ? { transitionDelay: `${staggerIndex * 80}ms` } : undefined}
    >
      <div className="image" style={{ backgroundImage: `url(${need.image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"})` }} />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {need.tag && <span className={needCategoryTagClass(need.tag)}>{need.tag}</span>}
        <span className={statusClass[need.status] || "tag tag-gray"}>{need.status}</span>
      </div>
      <div className="title">{need.title}</div>
      <div className="meta">{need.institution_name}{need.institution_location ? ` · ${need.institution_location}` : ""}</div>
      <div>
        <div className="progress-row">
          <span>Rs. {need.amount_funded.toLocaleString()} raised</span>
          <span>{pct}%</span>
        </div>
        <div className="progress">
          <div className={"progress-bar" + (isFull ? " full" : "")} style={{ width: pct + "%" }} />
        </div>
        <div className="meta" style={{ marginTop: 6 }}>Goal: Rs. {need.amount_required.toLocaleString()}</div>
      </div>
    </Link>
  );
}
