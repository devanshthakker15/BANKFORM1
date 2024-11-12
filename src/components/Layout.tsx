import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

import "../styles/layout.css"
import Breadcrumb from "./Breadcrumb";
const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Breadcrumb />
        <Outlet /> 
        <footer className="mt-5 d-flex justify-content-center">
        <p>&copy; 2024 Our Company. All Rights Reserved.&#174;</p>
      </footer>
      </div>
    </div>
  );
};

export default Layout;
