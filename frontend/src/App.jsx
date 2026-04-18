import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import DonorDashboard from "./pages/donor/Dashboard.jsx";
import DonorNeeds from "./pages/donor/Needs.jsx";
import DonorNeedDetail from "./pages/donor/NeedDetail.jsx";
import DonorInstitution from "./pages/donor/Institution.jsx";
import DonorProfile from "./pages/donor/Profile.jsx";

import InstDashboard from "./pages/institution/Dashboard.jsx";
import InstNeeds from "./pages/institution/Needs.jsx";
import InstNewNeed from "./pages/institution/NewNeed.jsx";
import InstBeneficiaries from "./pages/institution/Beneficiaries.jsx";
import InstitutionProfile from "./pages/institution/Profile.jsx";

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function footerExtraGap(pathname) {
  return (
    /^\/leaderboard(\/|$)/.test(pathname) ||
    /^\/contact(\/|$)/.test(pathname) ||
    /^\/donor-dashboard/.test(pathname) ||
    /^\/institution-dashboard/.test(pathname)
  );
}

export default function App() {
  const location = useLocation();
  const extraFooterGap = footerExtraGap(location.pathname);
  return (
    <>
      <Navbar />
      <main className="app-main">
        <div key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/donor-dashboard" element={<Protected role="donor"><DonorDashboard /></Protected>} />
          <Route path="/donor-dashboard/needs" element={<Protected role="donor"><DonorNeeds /></Protected>} />
          <Route path="/donor-dashboard/need/:id" element={<Protected role="donor"><DonorNeedDetail /></Protected>} />
          <Route path="/donor-dashboard/institution/:id" element={<Protected role="donor"><DonorInstitution /></Protected>} />
          <Route path="/donor-dashboard/profile" element={<Protected role="donor"><DonorProfile /></Protected>} />

          <Route path="/institution-dashboard" element={<Protected role="institution"><InstDashboard /></Protected>} />
          <Route path="/institution-dashboard/needs" element={<Protected role="institution"><InstNeeds /></Protected>} />
          <Route path="/institution-dashboard/needs/new" element={<Protected role="institution"><InstNewNeed /></Protected>} />
          <Route path="/institution-dashboard/beneficiaries" element={<Protected role="institution"><InstBeneficiaries /></Protected>} />
          <Route path="/institution-dashboard/profile" element={<Protected role="institution"><InstitutionProfile /></Protected>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      </main>
      <Footer className={extraFooterGap ? "footer footer--route-gap" : "footer"} />
    </>
  );
}

function NotFound() {
  return (
    <div className="container section">
      <div className="empty">
        <div className="icon">🔎</div>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}
