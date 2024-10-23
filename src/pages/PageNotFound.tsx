import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PageNotFound: React.FC = () => {


  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 text-danger">404</h1>
      <h2 className="mb-4">Oops! Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go to Home
      </Link>
    </div>
  );
};

export default PageNotFound;

// import React, { useState, useEffect } from "react";
// import "./PagenotFound.css";
// import { useNavigate, useLocation } from "react-router-dom";

// const PagenotFound: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [torchPosition, setTorchPosition] = useState({ top: 0, left: 0 });

//   // Handle mouse movement
//   useEffect(() => {
//     const handleMouseMove = (event: MouseEvent) => {
//       const torchSize = 350; // The size of your torch (width and height)

//       setTorchPosition({
//         top: event.pageY - torchSize / 2, // Subtract half the torch size to center it
//         left: event.pageX - torchSize / 2, // Subtract half the torch size to center it
//       });
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   const handleNavigation = (path: string) => {
//     navigate(path);
//   };

//   return (
//     <div className="pagenotfound">
//       <div className="text">
//         <h1>404</h1>
//         <h2>Uh, Ohh</h2>
//         <h3>
//           Sorry we can't find what you are looking for 'cuz it's so dark in here
//         </h3>
//       </div>
//       <div
//         className="torch"
//         style={{
//           top: torchPosition.top,
//           left: torchPosition.left,
//         }}
//       ></div>
//       <div>
//         <button
//           className="btn btn-primary mb-5 me-2"
//           onClick={() => handleNavigation("/")}
//         >
//           Go to Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PagenotFound;
