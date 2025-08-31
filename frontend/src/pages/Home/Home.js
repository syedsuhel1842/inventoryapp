import React from "react";
import { RiProductHuntLine, RiArrowRightLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Home.scss";
import heroImg from "../../assets/inv-img.png";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Home = () => {
  return (
    <div className="home">
      <nav className="nav-container">
        <div className="logo">
          <RiProductHuntLine size={32} />
          <span>InventoryPro</span>
        </div>

        <ul className="nav-links">
          <ShowOnLogout>
            <li className="nav-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogout>
            <li className="nav-item">
              <Link to="/login" className="nav-btn primary">Login</Link>
            </li>
          </ShowOnLogout>
          <ShowOnLogin>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-btn primary">Go to Dashboard</Link>
            </li>
          </ShowOnLogin>
        </ul>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Inventory <span className="highlight">Management</span> Solution
          </h1>
          <p className="hero-description">
            Streamline your warehouse operations with our real-time inventory 
            management system. Perfect for businesses of all sizes.
          </p>
          
          <div className="cta-buttons">
            <Link to="/dashboard" className="btn primary">
              Start Free Trial <RiArrowRightLine className="btn-icon" />
            </Link>
            <Link to="/register" className="btn secondary">
              Learn More
            </Link>
          </div>

          <div className="stats-container">
            <StatItem number="14K+" label="Brand Owners" />
            <StatItem number="23K+" label="Active Users" />
            <StatItem number="500+" label="Partners" />
          </div>
        </div>

        <div className="hero-image">
          <div className="image-wrapper">
            <img src={heroImg} alt="Inventory Management Dashboard" />
          </div>
        </div>
      </main>
    </div>
  );
};

const StatItem = ({ number, label }) => (
  <div className="stat-item">
    <span className="stat-number">{number}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export default Home;
