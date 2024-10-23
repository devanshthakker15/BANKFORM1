import React, { useState, useMemo, useEffect } from "react";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { useAppDispatch } from "../redux/hooks";
import { basicSchema } from "../schema/basicSchema";
import Card from "./Card";
import { useLocation, useNavigate } from "react-router-dom";
import { bankOptions, countries, states, cities } from "../utils/constants";
import "../styles/bankStyles.css";


interface BankFormProps {
  initialValues: any; // Replace 'any' with a proper type if available for better type safety
}

interface BankFormValues {
  bank_name: string;
  ifsc_code: string;
  branch_name: string;
  account_holder_name: string;
  account_number: string;
  opening_credit_balance: string;
  opening_debit_balance: string;
  is_upi_available: boolean;
  bank_address_line_1: string;
  bank_address_line_2?: string;
  bank_city: string;
  bank_state: string;
  bank_country: string;
  bank_pincode: string;
  is_active: boolean;
  id?: number;
}

const BankForm: React.FC <BankFormProps>= ({ initialValues }: { initialValues?: BankFormValues }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCorrupted, setIsCorrupted] = useState<boolean>(false);

  useEffect(() => {
    if (initialValues && initialValues.bank_address_line_1) {
      setSelectedCountry(initialValues.bank_country);
      setSelectedState(initialValues.bank_state);
    }
  }, [initialValues]);

  const defaultValues = useMemo(() => {
    return (
      initialValues || {
        bank_name: "",
        ifsc_code: "",
        branch_name: "",
        account_holder_name: "",
        account_number: "",
        opening_credit_balance: "",
        opening_debit_balance: "",
        is_upi_available: false,
        bank_address_line_1: "",
        bank_address_line_2: "",
        bank_city: "",
        bank_state: "",
        bank_country: "",
        bank_pincode: "",
        is_active: false,
      }
    );
  }, [initialValues]);

  const onSubmit = async (
    values: BankFormValues,
    { resetForm }: FormikHelpers<BankFormValues>
  ) => {
    setIsSubmitting(true);
    const existingData = JSON.parse(
      localStorage.getItem("bankFormData") || "[]"
    ) as BankFormValues[];

    if (values.id !== undefined) {
      const updatedData = existingData.map((item) =>
        item.id === values.id ? values : item
      );
      localStorage.setItem("bankFormData", JSON.stringify(updatedData));
    } else {
      const newId = existingData.length
        ? Math.max(...existingData.map((item) => item.id || 0)) + 1
        : 0;
      const updatedData = [...existingData, { ...values, id: newId }];
      localStorage.setItem("bankFormData", JSON.stringify(updatedData));
    }

    try {
      // Simulate async dispatch
      resetForm();
      navigate("/banks");
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={defaultValues}
        validationSchema={basicSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ values }) => (
          <Form>
            <Card title="General Information">
              <div className="row">
                <div className="col-md-6">
                  <SelectInput
                    label="Bank Name"
                    name="bank_name"
                    options={bankOptions}
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="IFSC Code"
                    placeholder="Enter IFSC code"
                    name="ifsc_code"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Branch Name"
                    placeholder="Enter Branch name"
                    name="branch_name"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Account Holder Name"
                    placeholder="Enter Account Holder Name"
                    name="account_holder_name"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Account Number"
                    placeholder="Enter Account Number"
                    name="account_number"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Opening Credit Balance"
                    placeholder="Enter Opening Credit Balance"
                    name="opening_credit_balance"
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Opening Debit Balance"
                    placeholder="Enter Opening Debit Balance"
                    name="opening_debit_balance"
                  />
                </div>
                <div className="col-md-6">
                  <SelectInput
                    label="Is UPI Available"
                    name="is_upi_available"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                </div>
                <div className="col-md-6">
                  <SelectInput
                    label="Is Active"
                    name="is_active"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                </div>
                
              </div>
            </Card>

            <Card title="Address Information">
              <div className="row">
                <div className="col-md-6">
                  <TextInput
                    label="Address Line 1"
                    placeholder="Enter Address Line 1"
                    name="bank_address_line_1"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Address Line 2"
                    placeholder="Enter Address Line 2"
                    name="bank_address_line_2"
                  />
                </div>
                <div className="col-md-4">
                  <SelectInput
                    label="Country"
                    name="bank_country"
                    options={countries}
                    required={true}
                  />
                </div>
                <div className="col-md-4">
                  <SelectInput
                    label="State"
                    name="bank_state"
                    options={states}
                    required={true}
                  />
                </div>
                <div className="col-md-4">
                  <SelectInput
                    label="City"
                    // placeholder="Select city"
                    options={cities}
                    name="bank_city"
                    required={true}
                  />
                </div>
                <div className="col-md-4">
                  <TextInput
                    label="Pincode"
                    placeholder="Enter Pincode"
                    name="bank_pincode"
                    required={true}
                  />
                </div>
              </div>
            </Card>

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-primary">
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BankForm;
