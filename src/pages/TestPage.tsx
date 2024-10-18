import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumb"; // Import dynamic breadcrumbs

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  function handleClick() {
    navigate(-1);
  }
  return (
    <>
      <Breadcrumbs />
      <div className="container text-center mt-5">
        <h2>Welcome to the Test Page</h2>
        <p>This page contains a breadcrumb navigation example.</p>
        {/* <Link to="/home" className="btn btn-primary m-2">
          Go to Home
        </Link> */}
        <button className="btn btn-primary m-2" onClick={handleClick}>
          Go to Home
        </button>
      </div>
    </>
  );
};

export default TestPage;
