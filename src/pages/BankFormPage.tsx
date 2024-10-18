import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import BankForm from "../components/BankForm";
import Breadcrumbs from "../components/Breadcrumb";
import "../App.css";

const BankFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); 
  const [initialValues, setInitialValues] = useState<any>(null); 
  const navigate = useNavigate(); 
  const location = useLocation(); 

  useEffect(() => {
    if (id) {
      const storedData = JSON.parse(localStorage.getItem("bankFormData") || "[]");
      const bankData = storedData.find((item: { id: number }) => item.id === Number(id));
      if (bankData) {
        setInitialValues(bankData);
      } else {
       
        navigate("*");
      }
    }
  }, [id, navigate]);

  // const handleBackToForm = () => {
  //   const newUrl = `${location.pathname}/home/bank-form`;
  //   navigate(newUrl); // Navigate to the new concatenated URL
  // };

  // const handleNavigation = (path: string) => {
  //   navigate(newPath);
  // };

  return (
    <div className="body">
      <Breadcrumbs />
      <div className="container mt-2">
        {/* View Submissions Button */}
        <div className="text-right mb-4 d-flex justify-content-end">
        <Link to="/banks" className="btn btn-secondary m-2">
          View Submissions
        </Link>

          {/* Concatenate Link path with current URL
            <button  onClick={() => handleNavigation("/bank-details-list")} className="btn btn-primary">View Submissions</button>
          */}
        </div>

        {/* Bank Details Form */}
        <div className="header mb-2">
          <h2>Bank Details Form</h2>
        </div>
        <BankForm initialValues={initialValues} /> {/* Render form with initial values or empty form */}

        {/* Back to Form Button */}
        <div className="text-left mt-4">
          {/* <button className="btn btn-secondary" onClick={handleBackToForm}>
            Back to Form
          </button> */}
        </div>
      </div>

      <footer className="mt-5 d-flex justify-content-center">
        <p>&copy; 2024 Our Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BankFormPage;
