import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BankForm from "../components/BankForm";
import Breadcrumbs from "../components/Breadcrumb";
import "../App.css";

const BankFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // Make id optional
  const [initialValues, setInitialValues] = useState<any>(null); // Replace `any` with your actual type if needed
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (id) {
      const storedData = JSON.parse(localStorage.getItem("bankFormData") || "[]");
      const bankData = storedData.find((item: { id: number }) => item.id === Number(id));
      if (bankData) {
        setInitialValues(bankData);
      } else {
        // If ID is not found, redirect to the empty form
        navigate("*");
      }
    }
  }, [id, navigate]);

  const handleBackToForm = () => {
    navigate("/bank-form"); 
  };

  return (
    <div className="body">
            <Breadcrumbs
        items={[
          { label: "Logout", path: "/" }, 
          { label: "Home", path: "/home"},
          { label: "Bank Form", path: "/bank-form" }, 
        ]}
      />
      <div className="container mt-2">

        {/* View Submissions Button */}
        <div className="text-right mb-4 d-flex justify-content-end">
          <Link to="/bank-details-list">
            <button className="btn btn-primary">View Submissions</button>
          </Link>
        </div>

        {/* Bank Details Form */}
        <div className="header mb-2">
          <h2>Bank Details Form</h2>
        </div>
        <BankForm initialValues={initialValues} /> {/* Render form with initial values or empty form */}

        {/* Back to Form Button */}
        {/* <div className="text-left mt-4">
          <button className="btn btn-secondary" onClick={handleBackToForm}>
            Back to Form
          </button>
        </div> */}
      </div>

      <footer className="mt-5 d-flex justify-content-center">
        <p>&copy; 2024 Our Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BankFormPage;
