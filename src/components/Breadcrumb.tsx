import React from "react";
import { Link, useLocation } from "react-router-dom";
import { generateBreadcrumbItems } from "../utils/breadcrumbsUtils"; 
import '../styles/Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const breadcrumbItems = generateBreadcrumbItems(location.pathname);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb"> 1 
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return isLast ? (
            <li key={index} className="breadcrumb-item active" aria-current="page">
              {item.label}
            </li>
          ) : (
            <li key={index} className="breadcrumb-item">
              <Link to={item.path}>{item.label}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
