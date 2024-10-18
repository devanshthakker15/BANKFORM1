import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import BankFormPage from "./pages/BankFormPage";
import LoginPage from "./pages/LoginPage";
import BankDetailsList from "./pages/BankDetailsList";
import PageNotFound from "./pages/PageNotFound";
import Layout from "./components/Layout";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";

// Protected Route Component
const ProtectedRoute: React.FC<{
  permission: string;
  children: React.ReactNode;
}> = ({ permission, children }) => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(currentUser);

  // Redirect if permission not present
  if (user.permissions.includes(permission)) {
    return <>{children}</>;
  }

  return <Navigate to="*" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Bank related routes */}
          <Route
            path="/banks"
            element={
              <ProtectedRoute permission="viewBanks">
                <BankDetailsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banks/add"
            element={
              <ProtectedRoute permission="addBank">
                <BankFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banks/edit/:id"
            element={
              <ProtectedRoute permission="editBank">
                <BankFormPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback for non-existing routes */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
