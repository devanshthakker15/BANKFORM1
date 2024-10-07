import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode; 
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5>{title}</h5>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
