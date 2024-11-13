// import Layout from "./components/Layout";
// import HomePage from "./pages/HomePage";
// import BankFormPage from "./pages/BankFormPage";
// import LoginPage from "./pages/LoginPage";
// import BankDetailsList from "./pages/BankDetailsList";
// import PageNotFound from "./pages/PageNotFound";
// import HSN_Codes from "./pages/HSN_Codes";
// import ManageEmployees from "./pages/ManageEmployees";
// import EmployeeForm from "./components/EmployeeForm";
// import ManageRoles from "./pages/ManageRoles";
// import ManageProducts from "./pages/ManageProducts";
// import { createBrowserRouter, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "./redux/store";
// import { PERMISSIONS } from "./utils/constants";
// import { hasPermission } from "./utils/commonFunction";

// // ProtectedRoute Component
// const ProtectedRoute: React.FC<{
//   moduleAlias: string;
//   action: string;
//   children: React.ReactNode;
// }> = ({ moduleAlias, action, children }) => {
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
//   const permissions = useSelector((state: RootState) => state.auth.permissions);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (!hasPermission(permissions, moduleAlias, action)) {
//     return <Navigate to="*" />;
//   }

//   return <>{children}</>;
// };

// // PrivateWrapper Component
// const PrivateWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const accessToken = localStorage.getItem("access_token");
//   if (!accessToken) {
//     return <Navigate to="/login" />;
//   }
//   return <>{children}</>;
// };

// // Centralized Route Configuration 
// const routesConfig = [
//   { path: "/banks", moduleAlias: "banks", action: PERMISSIONS.VIEW, element: <BankDetailsList /> },
//   { path: "/banks/add", moduleAlias: "banks", action: PERMISSIONS.ADD, element: <BankFormPage /> },
//   { path: "/banks/edit/:id", moduleAlias: "banks", action: PERMISSIONS.UPDATE, element: <BankFormPage /> },
//   { path: "/hsncodes", moduleAlias: "hsncodes", action: PERMISSIONS.VIEW, element: <HSN_Codes /> },
//   { path: "/account", moduleAlias: "account", action: PERMISSIONS.VIEW, element: <ManageEmployees /> },
//   { path: "/account/add", moduleAlias: "account", action: PERMISSIONS.ADD, element: <EmployeeForm /> },
//   { path: "/account/edit/:id", moduleAlias: "account", action: PERMISSIONS.UPDATE, element: <EmployeeForm /> },
//   { path: "/permissions", moduleAlias: "permissions", action: PERMISSIONS.VIEW, element: <ManageRoles /> },
//   { path: "/manage", moduleAlias: "manage", action: PERMISSIONS.VIEW, element: <ManageProducts /> },
// ];

// // Generate Route Elements from Config
// const dynamicRoutes = routesConfig.map((route) => ({
//   path: route.path,
//   element: (
//     <ProtectedRoute moduleAlias={route.moduleAlias} action={route.action}>
//       {route.element}
//     </ProtectedRoute>
//   ),
// }));

// // Router Setup
// export const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <LoginPage />,
//   },
//   {
//     path: "/",
//     element: (
//       <PrivateWrapper>
//         <Layout />
//       </PrivateWrapper>
//     ),
//     children: [
//       { path: "/", element: <HomePage /> }, 
//       ...dynamicRoutes, 
//     ],
//   },
//   // PageNotFound route as a fallback
//   {
//     path: "*",
//     element: <PageNotFound />,
//   },
// ]);

// export default router;

