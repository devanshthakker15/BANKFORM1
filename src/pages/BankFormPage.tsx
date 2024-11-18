// BankFormPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BankForm from "../components/BankForm";
import "../App.css";
import { apiGetBankDataById } from "../utils/getApi";
import { BankFormValues } from "../components/BankForm";
import Button from "../components/Button";
import Loader from "../components/Loader"; 

const BankFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [initialValues, setInitialValues] = useState<BankFormValues | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (id) {
        try {
          const data = await apiGetBankDataById(id);
          console.log(data.result);
          setInitialValues(data.result);
        } catch (error) {
          console.error("Failed to fetch bank data:", error);
          navigate("*");
        }
      } else {
        setInitialValues(null);
      }
      setIsLoading(false);
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

        {isLoading ? (
          <Loader />
        ) : (
          <BankForm initialValues={(initialValues) || undefined} />
        )}
      </div>
    </div>
  );
};

export default BankFormPage;