import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faBars,
  faHome,
  faClipboardList,
  faList,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css"; 

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]); // Store user permissions
  const location = useLocation();

  useEffect(() => {
    // Retrieve the current user's permissions from local storage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPermissions(user.permissions || []);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const hideContent = location.pathname === "/login";

  // If on the login page, don't render the sidebar at all
  if (hideContent) {
    return null;
  }

  return (
    <aside
      className={`main-sidebar sidebar-dark-primary elevation-4 ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      {/* Toggle Button */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isCollapsed ? faBars : faChevronLeft} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {permissions.includes("home") && (
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  <div className="nav-content">
                    <FontAwesomeIcon
                      icon={faHome}
                      className="nav-icon"
                    />
                    <p>Home</p>
                  </div>
                </Link>
              </li>
            )}
            {permissions.includes("form") && (
              <li className="nav-item">
                <Link to="/bank-form" className="nav-link">
                  <div className="nav-content">
                    <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
                    <p>
                      Bank Form
                      <span className="right badge badge-danger"></span>
                    </p>
                  </div>
                </Link>
              </li>
            )}
            {permissions.includes("viewDetails") && (
              <li className="nav-item">
                <Link to="/bank-details-list" className="nav-link">
                  <div className="nav-content">
                    <FontAwesomeIcon icon={faList} className="nav-icon" />
                    <p>
                      Bank Details List
                      <span className="right badge badge-danger"></span>
                    </p>
                  </div>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <div className="nav-content">
                  <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                  <p>Logout</p>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
