// BankFormPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BankForm from "../components/BankForm";
import "../App.css";
import { apiGetBankDataById } from "../utils/getApi";
import { BankFormValues } from "../components/BankForm";
import Button from "../components/Button";

const BankFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [initialValues, setInitialValues] = useState<BankFormValues | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const data = await apiGetBankDataById(id);
          console.log(data.result);
          setInitialValues(data.result); 
        } catch (error) {
          console.error("Failed to fetch bank data:", error);
          navigate("*");
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="body">
      <div className="container mt-2">
        <div className="text-right mb-4 d-flex justify-content-end">
          <Button
            text="View Submissions"
            variant="secondary"
            link="/banks"
          />
        </div>

        <div className="header mb-2">
          <h2>{id ? "Edit Bank Details" : "Add Bank Details"}</h2>
        </div>

        {/* Render BankForm with initialValues for editing or empty for new entry */}
        <BankForm initialValues={(initialValues) || undefined} />
      </div>
    </div>
  );
};

export default BankFormPage;
