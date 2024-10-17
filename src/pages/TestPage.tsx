import React from "react";
import Breadcrumbs from "../components/Breadcrumb";
import { Link } from "react-router-dom";
// import AccordionComponent from "../components/AccordianComponent";

const TestPage: React.FC = () => {
  const accordionItems = [
    {
      title: "Accordion Item #1",
      content:
        "This is the content for the first accordion item. You can customize this content.",
    },
    {
      title: "Accordion Item #2",
      content:
        "This is the content for the second accordion item. Feel free to modify the text here.",
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", path: "/home" },
          { label: "Bank Form", path: "/bank-form" },
          { label: "Test Page" },
        ]}
      />
      <div className="container text-center mt-2">
        <h2>Welcome to the Test Page</h2>
        <p>
          This page contains a breadcrumb navigation and an accordion example.
        </p>

        {/* <AccordionComponent items={accordionItems} /> */}

        <Link to="/home" className="btn btn-primary m-2">
          Go to Home
        </Link>
        <Link to="/bank-details-list" className="btn btn-secondary m-2">
          Go to List
        </Link>
      </div>
    </>
  );
};

export default TestPage;
