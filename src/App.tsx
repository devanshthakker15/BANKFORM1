// src/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

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
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (currentUser.permissions && currentUser.permissions.includes(permission)) {
    return <>{children}</>;
  }

  return <Navigate to="*" />;
};

const PrivateWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateWrapper>
        <Layout />
      </PrivateWrapper>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/banks',
        element: (
          <ProtectedRoute permission="viewBanks">
            <BankDetailsList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/banks/add',
        element: (
          <ProtectedRoute permission="addBank">
            <BankFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/banks/edit/:id',
        element: (
          <ProtectedRoute permission="editBank">
            <BankFormPage />
          </ProtectedRoute>
        ),
      },
      // Dynamic routes for modules
      {
        path: '/hsncodes',
        element: <HSN_Codes />,
      },
      {
        path: '/account',
        element: <ManageEmployees />,
      },
      {
        path: '/account/add',
        element: <EmployeeForm />,
      },
      {
        path: '/account/edit/:id',
        element: <EmployeeForm />,
      },
      {
        path: '/permissions',
        element: <ManageRoles />,
      },
      {
        path: '/manage',
        element: <ManageProducts />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/banks/hsn',
    element: <FormPage />,
  },
]);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;