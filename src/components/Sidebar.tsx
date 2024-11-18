import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faBars,
  faList,
  faSignOutAlt,
  faClipboard,
  faUser,
  faTasks,
  faShoppingCart,
  faCode,
  faUsers,
  faBank,
  faGift,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css";
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/AuthSlice";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { permissions } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const moduleIcons: { [key: string]: any } = {
    location: faList,
    category: faList,
    customer: faList,
    brands: faList,
    uom: faList,
    tax: faList,
    terms: faList,
    mode: faMoneyBill,
    sub_category: faList,
    group: faList,
    orders: faShoppingCart,
    returns: faList,
    hold: faList,
    store: faList,
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
        <nav>
          <ul className="nav nav-pills nav-sidebar flex-column">
            {permissions.map((perm) => {
              if (!perm.module) return null; // Exclude permissions where module is null

              const isActive = location.pathname.startsWith(`/${perm.module.alias}`);
              return (
                <li key={perm.id} className={`nav-item ${isActive ? "active" : ""}`}>
                  <Link to={`/${perm.module.alias}`} className="nav-link">
                    <FontAwesomeIcon icon={moduleIcons[perm.module.alias] || faList} className="nav-icon" />
                    <p>{perm.module.module_name}</p>
                  </Link>
                </li>
              );
            })}

            <li className="nav-item">
              <Link to="/login" className="nav-link" onClick={() => dispatch(logout())}>
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                <p>Logout</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
