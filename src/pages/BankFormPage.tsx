import React from "react";
// import BankForm from "../components/BankForm.tsx";
import BankForm from "../components/BankForm";
import { Link } from "react-router-dom";
import "../App.css";

const BankFormPage: React.FC = () => {
  return (
    <div className="body">
      <div className="container mt-5">
        <div className="text-right mb-4 d-flex justify-content-start">
            {/* Enter Offcanvas here */}
        </div>
        {/* View Submissions Button */}
        <div className="text-right mb-4 d-flex justify-content-end">
          <Link to="/bank-details-list">
            <button className="btn btn-primary">View Submissions</button>
          </Link>
        </div>

        {/* Bank Details Form */}
        <div className="header">
          <h2>Bank Details Form</h2>
        </div>
        <BankForm />
      </div>
      
      <footer className="mt-5 d-flex justify-content-center">
        <p>&copy; 2024 Our Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BankFormPage;