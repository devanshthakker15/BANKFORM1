import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BankFormPage from "./pages/BankFormPage";
import BankDetailsList from "./pages/BankDetailsList";
import Layout from "./components/Layout"; // Import Layout
// import LoginPage from "./pages/LoginPage";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LoginPage from "./pages/LoginPage";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LoginPage />} />
          {/* Update this route to include id parameter */}
          <Route path="/bank-form/:id?" element={<BankFormPage />} />
          <Route path="/bank-details-list" element={<BankDetailsList />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
