// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faBars,
  faHome,
  faList,
  faSignOutAlt,
  faClipboard,
  faBank,
  faCarAlt,
  faPercentage,
  faUser,
  faTasks,
  faShoppingCart,
  faCode,
  faBan,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { apiGet } from "../utils/getApi";
import "../styles/sidebar.css";
import { EXCLUDED_MODULES } from "../utils/constants";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
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

  const hideContent = location.pathname === "/login";

  if (hideContent) {
    return null;
  }

  const moduleIcons = {
    Home: faHome,
    account: faUser ,
    permissions: faTasks,
    manage: faShoppingCart,
    hsncodes: faCode,
    banks: faBank,
  };

   
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
            {modules.map((module) => {
              if (EXCLUDED_MODULES.includes(module.module.module_name)) {
                return null;
              }
              const icon = moduleIcons[module.module.alias] || faList;
              return (
                <li key={module.id} className="nav-item d-flex justify-content-start">
                  <Link to={`/${module.module.alias}`} className="nav-link">
                    <div className="nav-content">
                      <FontAwesomeIcon icon={icon} className="nav-icon" />
                      <p>{module.module.module_name}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
            <li className="nav-item d-flex justify-content-start">
              <Link to="/account/add" className="nav-link">
                <div className="nav-content">
                  <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                  <p>Add Employee</p>
                </div>
              </Link>
            </li>
            <li className="nav-item d-flex justify-content-start">
              <Link to="/banks/add" className="nav-link">
                <div className="nav-content">
                  <FontAwesomeIcon icon={faClipboard} className="nav-icon" />
                  <p>Add form</p>
                </div>
              </Link>
            </li>
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
