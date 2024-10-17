import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import BankFormPage from "./pages/BankFormPage";
import LoginPage from "./pages/LoginPage";
import BankDetailsList from "./pages/BankDetailsList";
import PageNotFound from "./pages/PageNotFound";
import TestPage from "./pages/TestPage";

import Layout from "./components/Layout";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";

const ProtectedRoute: React.FC<{
  permission: string;
  children: React.ReactNode;
}> = ({ permission, children }) => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  const user = JSON.parse(currentUser);
  if (user.permissions.includes(permission)) {
    return <>{children}</>;
  }

  return <Navigate to="*" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/test" element={<TestPage />} />

          {/* Protected Routes */}
          <Route
            path="/bank-form/:id?"
            element={
              <ProtectedRoute permission="form">
                <BankFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bank-details-list"
            element={
              <ProtectedRoute permission="viewDetails">
                <BankDetailsList />
                {/* <BreadcrumbPage/> */}
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
