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
import { generateRoutes } from "./routes";



const App: React.FC = () => {
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const dynamicRoutes = generateRoutes(permissions);

  const router = createBrowserRouter(dynamicRoutes);

  return <RouterProvider router={router} />;
};

export default App;
