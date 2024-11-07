// src/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import BankFormPage from "./pages/BankFormPage";
import LoginPage from "./pages/LoginPage";
import BankDetailsList from "./pages/BankDetailsList";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout";
import FormPage from "./pages/FormPage";

import HSN_Codes from "./pages/HSN_Codes";
import ManageEmployees from "./pages/ManageEmployees";
import ManageRoles from "./pages/ManageRoles";
import ManageProducts from "./pages/ManageProducts";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";
import EmployeeForm from "./components/EmployeeForm";

const ProtectedRoute: React.FC<{
  permission: string;
  children: React.ReactNode;
}> = ({ permission, children }) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (currentUser.permissions && currentUser.permissions.includes(permission)) {
    return <>{children}</>;
  }

  return <Navigate to="*" />;
};

const PrivateWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/banks/hsn" element={<FormPage />} />

        <Route path="/" element={<PrivateWrapper><Layout /></PrivateWrapper>}>
          <Route index element={<HomePage />} />

          <Route path="/banks" element={<ProtectedRoute permission="viewBanks"><BankDetailsList /></ProtectedRoute>} />
          <Route path="/banks/add" element={<ProtectedRoute permission="addBank"><BankFormPage /></ProtectedRoute>} />
          <Route path="/banks/edit/:id" element={<ProtectedRoute permission="editBank"><BankFormPage /></ProtectedRoute>} />

          {/* Dynamic routes for modules */}
          <Route path="/hsncodes" element={<HSN_Codes />} />
          <Route path="/account" element={<ManageEmployees />} />
          <Route path="/account/add" element={<EmployeeForm />} />
          <Route path="/account/edit/:id" element={<EmployeeForm />} />
          <Route path="/permissions" element={<ManageRoles />} />
          <Route path="/manage" element={<ManageProducts />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
