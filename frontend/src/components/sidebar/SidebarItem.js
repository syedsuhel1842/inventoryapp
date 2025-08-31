import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

// Active link styles
const activeLink = ({ isActive }) => isActive ? "active" : "";
const activeSublink = ({ isActive }) => isActive ? "active" : "";

const SidebarItem = ({ item, isOpen, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const hasChildren = item.childrens && item.childrens.length > 0;

  // Auto-expand parent if child is active
  useEffect(() => {
    if (hasChildren) {
      const isChildActive = item.childrens.some(
        child => location.pathname === child.path
      );
      if (isChildActive) {
        setIsExpanded(true);
      }
    }
  }, [location.pathname, item.childrens, hasChildren]);

  const toggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Parent item with children
  if (hasChildren) {
    return (
      <div className={`sidebar-parent ${isExpanded ? 'expanded' : ''}`}>
        <div 
          className={`sidebar-item ${activeLink({ isActive: isExpanded })}`}
          onClick={toggleExpand}
        >
          <div className="sidebar-title">
            <span className="title-content">
              {item.icon && <span className="icon">{item.icon}</span>}
              {isOpen && <span className="title-text">{item.title}</span>}
            </span>
            {isOpen && (
              <span className="arrow-icon">
                {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
              </span>
            )}
          </div>
        </div>
        
        <div className={`sidebar-children ${isExpanded ? 'show' : ''}`}>
          {item.childrens.map((child, index) => (
            <NavLink 
              key={index} 
              to={child.path} 
              className={`sidebar-link ${activeSublink}`}
              onClick={onClick}
            >
              <div className="sidebar-item child">
                <div className="sidebar-title">
                  <span className="title-content">
                    {child.icon && <span className="icon">{child.icon}</span>}
                    {isOpen && <span className="title-text">{child.title}</span>}
                  </span>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  // Single item without children
  return (
    <NavLink 
      to={item.path} 
      className={activeLink}
      onClick={onClick}
    >
      <div className="sidebar-item">
        <div className="sidebar-title">
          <span className="title-content">
            {item.icon && <span className="icon">{item.icon}</span>}
            {isOpen && <span className="title-text">{item.title}</span>}
          </span>
        </div>
      </div>
    </NavLink>
  );
};

export default SidebarItem;
