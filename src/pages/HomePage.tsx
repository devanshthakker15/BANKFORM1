import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
// import bankingImg1 from "../assets/banking1.jpg";
import bankingImg2 from "../assets/banking2.jpg";
import bankingImg3 from "../assets/banking3.jpg";
import bankingImg4 from "../assets/banking4.jpg";
import Breadcrumbs from "../components/Breadcrumb";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="body">
      <Breadcrumbs />
      <div className="container mt-2">
        {/* Header */}
        <div className="header text-center mt-4 mb-3">
          <h2>Welcome to Our Bank Application</h2>
          <p>Please use the button below to access the bank details form.</p>
        </div>

        {/* Carousel Section */}
        <div
          id="bankingCarousel"
          className="carousel slide mt-2"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={bankingImg4}
                className="d-block w-100"
                alt="Banking Activity 1"
              />
            </div>
            <div className="carousel-item">
              <img
                src={bankingImg2}
                className="d-block w-100"
                alt="Banking Activity 2"
              />
            </div>
            <div className="carousel-item">
              <img
                src={bankingImg3}
                className="d-block w-100"
                alt="Banking Activity 3"
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#bankingCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#bankingCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Go to Form Button */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-primary mb-5 me-2"
            onClick={() => handleNavigation("/banks")}
          >
            Go to Bank welcome
          </button>
        </div>
      </div>

      <footer className="mt-5 d-flex justify-content-center">
        <p>&copy; 2024 Our Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
