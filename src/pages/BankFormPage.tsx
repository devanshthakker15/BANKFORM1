import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import BankForm from "../components/BankForm";
import Breadcrumbs from "../components/Breadcrumb";
import "../App.css";


const BankFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); 
  const [initialValues, setInitialValues] = useState<any>(null); 
  const navigate = useNavigate(); 
  // const location = useLocation(); 

  useEffect(() => {
    // axiosFunction();
    if (id) {
      const storedData = JSON.parse(localStorage.getItem("bankFormData") || "[]");
      const bankData = storedData.find((item: { id: number }) => item.id === Number(id));
      if (bankData) {
        setInitialValues(bankData);
      } else {
       
        navigate("*");
        
      }
    }
  }, [id]);

  // const handleBackToForm = () => {
  //   const newUrl = `${location.pathname}/home/bank-form`;
  //   navigate(newUrl); // Navigate to the new concatenated URL
  // };

  // const handleNavigation = (path: string) => {
  //   navigate(newPath);
  // };

  // _____________________________________________________________
  // async function axiosFunction(){
  //   const result = await axios.get('http://192.168.1.44:8001/api/payment/banks/',{
  //     headers:{
  //       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5Njc4MjA3LCJpYXQiOjE3Mjk1OTE4MDcsImp0aSI6ImM2NGU1ZmUxYTM1ODQ1NDdiYzlhNzY0MWEwMDdiMThhIiwiZW1haWwiOiJhZG1pbkBhdmFyeWEuaW4ifQ.seEzUhIA1D8OjH3kn0YmZKCp6HrP1n58lhwbLqh1XCQ'
  //     }
  //   })
  // console.log(result)
  // ___________________________________________________________________
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
        <p>&copy; 2024 Our Company. All Rights Reserved.&#174;</p>
      </footer>
    </div>
  );
};

export default BankFormPage;