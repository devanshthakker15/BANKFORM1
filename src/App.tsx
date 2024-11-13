import React from "react";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BankDetailsList from "./pages/BankDetailsList";
import BankFormPage from "./pages/BankFormPage";
import HSN_Codes from "./pages/HSN_Codes";
import ManageEmployees from "./pages/ManageEmployees";
import EmployeeForm from "./components/EmployeeForm";
import ManageRoles from "./pages/ManageRoles";
import ManageProducts from "./pages/ManageProducts";
import PageNotFound from "./pages/PageNotFound";
import { hasPermission } from "./utils/commonFunction";
import { PERMISSIONS } from "./utils/constants";

// Map module alias to components for each permission type
const moduleComponentMap: { [key: string]: { [key: string]: React.ReactNode } } = {
  banks: {
    [PERMISSIONS.VIEW]: <BankDetailsList />,
    [PERMISSIONS.ADD]: <BankFormPage />,
    [PERMISSIONS.UPDATE]: <BankFormPage />,
  },
  hsncodes: {
    [PERMISSIONS.VIEW]: <HSN_Codes />,
  },
  account: {
    [PERMISSIONS.VIEW]: <ManageEmployees />,
    [PERMISSIONS.ADD]: <EmployeeForm />,
    [PERMISSIONS.UPDATE]: <EmployeeForm />,
  },
  permissions: {
    [PERMISSIONS.VIEW]: <ManageRoles />,
  },
  manage: {
    [PERMISSIONS.VIEW]: <ManageProducts />,
  },
};

// Generate routes based on permissions
const generateRoutes = (permissions: any[]) => {
  return permissions.flatMap((currentperm) => {
    const alias = currentperm.module.alias;
    const routesForModule = [];

    if (currentperm.perm_view) {
      routesForModule.push({
        path: `/${alias}`,
        element: (
          <ProtectedRoute moduleName={alias} action={PERMISSIONS.VIEW}>
            {moduleComponentMap[alias]?.[PERMISSIONS.VIEW]}
          </ProtectedRoute>
        ),
      });
    }
    if (currentperm.perm_add) {
      routesForModule.push({
        path: `/${alias}/add`,
        element: (
          <ProtectedRoute moduleName={alias} action={PERMISSIONS.ADD}>
            {moduleComponentMap[alias]?.[PERMISSIONS.ADD]}
          </ProtectedRoute>
        ),
      });
    }
    if (currentperm.perm_edit) {
      routesForModule.push({
        path: `/${alias}/edit/:id`,
        element: (
          <ProtectedRoute moduleName={alias} action={PERMISSIONS.UPDATE}>
            {moduleComponentMap[alias]?.[PERMISSIONS.UPDATE]}
          </ProtectedRoute>
        ),
      });
    }

    return routesForModule;
  });
};

// ProtectedRoute component for permission-based access
const ProtectedRoute: React.FC<{ moduleName: string; action: string; children: React.ReactNode }> = ({
  moduleName,
  action,
  children,
}) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const permissions = useSelector((state: RootState) => state.auth.permissions);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!hasPermission(permissions, moduleName, action)) {
    console.warn(`Access denied for ${action} on module ${moduleName}`);
    return <Navigate to="*" />;
  }

  return <>{children}</>;
};

// PrivateWrapper component for authenticated access
const PrivateWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const dynamicRoutes = generateRoutes(permissions);

  const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    {
      path: "/",
      element: (
        <PrivateWrapper>
          <Layout />
        </PrivateWrapper> 
      ),
      children: [{ path: "/", element: <HomePage /> }, 
        { path: "/account/add", element: <EmployeeForm /> }, 
        ...dynamicRoutes],
    },
    
    { path: "*", element: <PageNotFound /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
