import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

import "../styles/layout.css"
const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;
