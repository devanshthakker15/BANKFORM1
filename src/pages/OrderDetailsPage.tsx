// BankFormPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BankForm from "../components/BankForm";
import "../App.css";
import { apiGetBankDataById } from "../utils/getApi";
import { BankFormValues } from "../components/BankForm";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Card from "../components/Card";

const OrderDetailsPage: React.FC = () => {
  return (
    <div className="body">
      <div className="row">
        <Card title="Customer Details">
            <div>
                    
            </div>
        </Card>
      
      </div>
    </div>
  );
};

export default OrderDetailsPage;
