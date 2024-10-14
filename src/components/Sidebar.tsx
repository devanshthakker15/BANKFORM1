import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTh,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css"; 

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); 

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

 
  const hideContent = location.pathname === "/login";

  return (
    <aside
      className={`main-sidebar sidebar-dark-primary elevation-4 ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      {/* Toggle Button */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        

        {/* Sidebar Menu */}
        {!hideContent && (
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  <div className="nav-content">
                    <FontAwesomeIcon
                      icon={faTachometerAlt}
                      className="nav-icon"
                    />
                    <p>Home</p>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/bank-form" className="nav-link">
                  <div className="nav-content">
                    <FontAwesomeIcon icon={faTh} className="nav-icon" />
                    <p>
                      Bank Form
                      <span className="right badge badge-danger"></span>
                    </p>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/bank-details-list" className="nav-link">
                  <div className="nav-content">
                    <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
                    <p>
                      Bank Details List
                      <span className="right badge badge-danger"></span>
                    </p>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <div className="nav-content">
                    <FontAwesomeIcon icon={faTh} className="nav-icon" />
                    <p>Logout</p>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
