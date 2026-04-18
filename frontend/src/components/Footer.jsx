import { Link } from "react-router-dom";
import sproutLogo from "../assets/sprout.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src={sproutLogo} alt="Yaqeen" />
            <span>Yaqeen</span>
          </div>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <p>© {new Date().getFullYear()} Yaqeen — Secure, transparent, directed giving.</p>
        </div>
      </div>
    </footer>
  );
}
