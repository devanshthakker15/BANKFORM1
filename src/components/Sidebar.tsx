import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faBars,
  faHome,
  faList,
  faSignOutAlt,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { apiGet } from "../utils/getApi"; // Import the apiGet function
import "../styles/sidebar.css";
import { EXCLUDED_MODULES } from "../utils/constants";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  const [isManageHsnDropdownOpen, setIsManageHsnDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await apiGet("/api/account/user/permissions/");
        if (data.success) {
          const userPermissions = data.result.permissions;
          const viewableModules = userPermissions.filter(
            (perm: any) => perm.module.action_view === 1
          );
          setModules(viewableModules);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleManageHsnDropdown = () => {
    setIsManageHsnDropdownOpen((prev) => !prev);
  };

  const hideContent = location.pathname === "/login";

  if (hideContent) {
    return null;
  }

  return (
    <aside
      className={`main-sidebar sidebar-dark-secondary elevation-4 ${
        isCollapsed ? "collapsed" : ""
      }`}
    >
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isCollapsed ? faBars : faChevronLeft} />
      </div>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item d-flex justify-content-start">
              <Link to={`/`} className="nav-link">
                <div className="nav-content">
                  <FontAwesomeIcon icon={faHome} className="nav-icon" />
                  <p>Home</p>
                </div>
              </Link>
            </li>

            {/* Manage Products Menu */}
            <li className={`nav-item has-treeview ${isManageHsnDropdownOpen ? "menu-open" : ""}`}>
              <Link to="#" className="nav-link" onClick={toggleManageHsnDropdown}>
                <div className="nav-content">
                  <FontAwesomeIcon icon={faFolder} className="nav-icon" />
                  <p>
                    Manage Products
                    <i className={`right fas fa-angle-${isManageHsnDropdownOpen ? "up" : "down"}`} />
                  </p>
                </div>
              </Link>
              <ul className={`nav nav-treeview ${isManageHsnDropdownOpen ? 'open' : ''}`}>
                {modules.map((module) => {
                  if (module.module.module_name === "Manage HSN Codes") {
                    return (
                      <li key={module.id} className="nav-item">
                        <Link to={`/${module.module.alias}`} className="nav-link">
                          <div className="nav-content">
                            <FontAwesomeIcon icon={faList} className="nav-icon" />
                            <p>{module.module.module_name}</p>
                          </div>
                        </Link>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </li>

            {/* Render other modules */}
            {modules.map((module) => {
              if (EXCLUDED_MODULES.includes(module.module.module_name) || module.module.module_name === "Manage HSN Codes") {
                return null; // Skip rendering excluded modules
              }
              return (
                <li key={module.id} className="nav-item d-flex justify-content-start">
                  <Link to={`/${module.module.alias}`} className="nav-link">
                    <div className="nav-content">
                      <FontAwesomeIcon icon={faList} className="nav-icon" />
                      <p>{module.module.module_name}</p>
                    </div>
                  </Link>
                </li>
              );
            })}

            <li className="nav-item d-flex justify-content-start">
              <Link to="/login" className="nav-link">
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
