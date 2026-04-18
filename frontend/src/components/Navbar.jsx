import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import sproutLogo from "../assets/sprout.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const dashboardPath = user?.role === "donor" ? "/donor-dashboard" : "/institution-dashboard";
  const profilePath = user?.role === "donor" ? "/donor-dashboard/profile" : "/institution-dashboard/profile";

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <img src={sproutLogo} alt="Yaqeen" className="logo-img" />
          <span>Yaqeen</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            About
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Leaderboard
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Contact
          </NavLink>
          {user ? (
            <>
              <NavLink to={dashboardPath} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                Dashboard
              </NavLink>
              <div className="user-menu" ref={menuRef}>
                <button
                  type="button"
                  className={"user-menu-trigger" + (menuOpen ? " is-open" : "")}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <span className="user-menu-avatar" aria-hidden>
                    <svg
                      className="user-menu-avatar-svg"
                      viewBox="0 0 96 96"
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                    >
                      <circle cx="48" cy="48" r="46" fill="#E8EAED" stroke="#DDE2E7" strokeWidth="1.5" />
                      <circle cx="48" cy="28" r="18" fill="#C5CED6" />
                      <ellipse cx="48" cy="68" rx="30" ry="26" fill="#C5CED6" />
                    </svg>
                  </span>
                </button>
                {menuOpen && (
                  <div className="user-menu-dropdown" role="menu">
                    <Link
                      to={profilePath}
                      role="menuitem"
                      className="user-menu-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button type="button" role="menuitem" className="user-menu-item user-menu-item--danger" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
