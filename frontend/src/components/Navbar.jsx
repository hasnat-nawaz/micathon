import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import sproutLogo from "../assets/sprout.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const dashboardPath = user?.role === "donor" ? "/donor-dashboard" : "/institution-dashboard";

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <img src={sproutLogo} alt="Yaqeen" className="logo-img" />
          <span>Yaqeen</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>About</NavLink>
          <NavLink to="/leaderboard" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Leaderboard</NavLink>
          <NavLink to="/contact" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Contact</NavLink>
          {user ? (
            <>
              <Link to={dashboardPath} className="btn btn-primary btn-sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
