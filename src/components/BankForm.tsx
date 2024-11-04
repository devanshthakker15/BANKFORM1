import React, { useMemo, useEffect } from "react";
import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import Card from "./Card";
import { basicSchema } from "../schema/basicSchema";
import { YES_NO } from "../utils/constants";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../redux/locationSlice";
import "../styles/bankStyles.css";
import { bankOptions } from "../utils/constants";
import { submitBankFormData } from "../utils/getApi";
import { useNavigate } from "react-router-dom";

interface BankFormProps {
  initialValues?: BankFormValues;
}

interface BankFormValues {
  bank_name: string;
  ifsc_code: string;
  branch_name: string;
  account_holder_name: string;
  account_number: string;
  opening_credit_balance: number;
  opening_debit_balance: number;
  is_upi_available: boolean;
  bank_address_line_1: string;
  bank_address_line_2?: string;
  bank_city: string;
  bank_state: string;
  bank_country: string;
  bank_pincode: string;
  is_active: number;
  id?: number;
}

const BankForm: React.FC<BankFormProps> = ({ initialValues }) => {
  const dispatch = useAppDispatch();
  const { countries, states, cities } = useAppSelector(
    (state) => state.location
  );

  const defaultValues = useMemo(
    () =>
      initialValues || {
        bank_name: "",
        ifsc_code: "",
        branch_name: "",
        account_holder_name: "",
        account_number: "",
        opening_credit_balance: "",
        opening_debit_balance: "",
        is_upi_available: 1,
        bank_address_line_1: "",
        bank_address_line_2: "",
        bank_city: "",
        bank_state: "",
        bank_country: "",
        bank_pincode: "",
        is_active: 1,
      },
    [initialValues]
  );

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);


  const navigate=useNavigate();
  const handleSubmit = async (values: BankFormValues) => {
    try {
      console.log("Submitting form data:", values);
      const response = await submitBankFormData(values);
      console.log("API Response:", response);
    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
    navigate("/banks/");
  };

  return (
    <div>
      <Formik
        initialValues={defaultValues}
        validationSchema={basicSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Card title="General Information">
              <div className="row">
                <div className="col-md-6">
                  <SelectInput
                    label="Bank Name"
                    name="bank_name"
                    options={bankOptions}
                    required={true}
                    onChange={(newValue) =>
                      setFieldValue("bank_name", newValue.value)
                    }
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
                    options={YES_NO}
                  />
                </div>
                <div className="col-md-6">
                  <SelectInput
                    label="Is Active"
                    name="is_active"
                    options={YES_NO}
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
                    onChange={(newValue) => {
                      setFieldValue(
                        "bank_country",
                        newValue ? newValue.value : ""
                      );
                      setFieldValue("bank_state", "");
                      setFieldValue("bank_city", "");
                      if (newValue) dispatch(fetchStates(newValue.value));
                    }}
                    // onChange={(newValue, actions) => {
                    //   if (actions.action === "clear") {
                    //     setFieldValue("bank_state", "");
                    //   } else {
                    //     dispatch(fetchStates(newValue.value));
                    //   }
                    // }}
                  />
                </div>
                <div className="col-md-4">
                  <SelectInput
                    label="State"
                    name="bank_state"
                    options={states}
                    required={true}
                    value={values.bank_state || ""}
                    onChange={(newValue) => {
                      setFieldValue(
                        "bank_state",
                        newValue ? newValue.value : ""
                      );
                      setFieldValue("bank_city", "");
                      if (newValue) dispatch(fetchCities(newValue.value));
                    }}
                    // onChange={(newValue, actions) => {
                    //   if (actions.action === "clear") {
                    //     setFieldValue("bank_city", "");
                    //   } else {
                    //     dispatch(fetchCities(newValue.value));
                    //   }
                    // }}
                  />
                </div>
                <div className="col-md-4">
                  <SelectInput
                    label="City"
                    name="bank_city"
                    options={cities}
                    required={true}
                    value={values.bank_city || ""}
                    onChange={(newValue) =>
                      setFieldValue("bank_city", newValue ? newValue.value : "")
                    }
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
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BankForm;
