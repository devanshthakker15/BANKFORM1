// src/components/Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loader from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faBars,
  faHome,
  faList,
  faSignOutAlt,
  faClipboard,
  faBank,
  faUser,
  faTasks,
  faShoppingCart,
  faCode,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { EXCLUDED_MODULES } from "../utils/constants";
import "../styles/sidebar.css";
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/AuthSlice";
const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { permissions, loading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  if (location.pathname === "/login") return null;
  if (loading) return <Loader />;

  const moduleIcons: { [key: string]: any } = {
    Home: faHome,
    account: faUser,
    permissions: faTasks,
    manage: faShoppingCart,
    hsncodes: faCode,
    banks: faBank,
  };
  
  return (
    <aside className={`main-sidebar sidebar-dark-secondary elevation-4 ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isCollapsed ? faBars : faChevronLeft} />
      </div>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item d-flex justify-content-start">
              <Link to={`/`} className="nav-link">
                <div className="nav-content">
                  <FontAwesomeIcon icon={faHome} className="nav-icon" />
                  <p>Home</p>
                </div>
              </Link>
            </li>
            {permissions
              .filter((perm) => !EXCLUDED_MODULES.includes(perm.module.module_name))
              .map((perm) => {
                const icon = moduleIcons[perm.module.alias] || faList;
                return (
                  <li key={perm.id} className="nav-item d-flex justify-content-start">
                    <Link to={`/${perm.module.alias}`} className="nav-link">
                      <div className="nav-content">
                        <FontAwesomeIcon icon={icon} className="nav-icon" />
                        <p>{perm.module.module_name}</p>
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
              <Link to="/login" className="nav-link" onClick={() => dispatch(logout())}>
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
