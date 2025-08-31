import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { RiProductHuntLine } from "react-icons/ri";
import menu from "../../data/sidebar";
import SidebarItem from "./SidebarItem";
import "./Sidebar.scss";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showOverlay, setShowOverlay] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Toggle sidebar
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (isMobile) {
      setShowOverlay(newState);
    }
  };

  // Close sidebar when clicking on overlay
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
      setShowOverlay(false);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowOverlay(false);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [location]);

  const goHome = () => {
    navigate("/");
    if (isMobile) closeSidebar();
  };

  return (
    <div className="layout">
      {/* Mobile overlay */}
      {showOverlay && (
        <div 
          className={`overlay ${showOverlay ? 'show' : ''}`} 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="top_section">
          <div className="logo" onClick={goHome}>
            <div className="icon">
              <RiProductHuntLine size={28} />
            </div>
            <span>Inventory</span>
          </div>

          <div className="bars" onClick={toggleSidebar}>
            {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          {menu.map((item, index) => (
            <SidebarItem 
              key={index} 
              item={item} 
              isOpen={isOpen}
              onClick={closeSidebar}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className={!isOpen && isMobile ? 'sidebar-collapsed' : ''}>
        {!isOpen && isMobile && (
          <button className="mobile-menu-toggle" onClick={toggleSidebar}>
            <HiMenuAlt3 size={24} />
          </button>
        )}
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
