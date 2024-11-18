import React, { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import Button from "./Button";
import Card from "./Card";
import { basicSchema } from "../schema/basicSchema";
import { YES_NO, bankOptions } from "../utils/constants";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../redux/locationSlice";
import "../styles/bankStyles.css";
import { submitBankDataAsync } from "../redux/formSlice";

export interface BankFormValues {
  bank_name: string;
  ifsc_code: string;
  branch_name: string;
  account_holder_name: string;
  account_number: string;
  opening_credit_balance: number;
  opening_debit_balance: number;
  is_upi_available: number;
  bank_address_line_1: string;
  bank_address_line_2?: string;
  bank_city: any;
  bank_state: any;
  bank_country: any;
  bank_pincode: string;
  is_active: number;
  id?: number;
}

interface BankFormProps {
  initialValues?: BankFormValues;
}

const BankForm: React.FC<BankFormProps> = ({ initialValues }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { countries, states, cities } = useAppSelector(
    (state) => state.location
  );

  const [formData, setFormData] = useState<BankFormValues | null>(
    initialValues || null
  );

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        bank_country: initialValues.bank_country?.id || "",
        bank_state: initialValues.bank_state?.id || "",
        bank_city: initialValues.bank_city?.id || "",
        is_upi_available: initialValues.is_upi_available ? 1 : 0,
      });

      if (initialValues.bank_country)
        dispatch(fetchStates(initialValues.bank_country.id));
      if (initialValues.bank_state)
        dispatch(fetchCities(initialValues.bank_state.id));
    } else {
      dispatch(fetchCountries());
    }
  }, [initialValues, dispatch]);

  const defaultValues = useMemo(
    () =>
      formData || {
        bank_name: "",
        ifsc_code: "",
        branch_name: "",
        account_holder_name: "",
        account_number: "",
        opening_credit_balance: 0,
        opening_debit_balance: 0,
        bank_address_line_1: "",
        bank_address_line_2: "",
        bank_city: "",
        bank_state: "",
        bank_country: "",
        bank_pincode: "",
        is_upi_available: 1,
        is_active: 1,
      },
    [formData]
  );

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      dispatch(submitBankDataAsync({ values, id }));
      console.log("Button Clicked");
      navigate("/banks");
    } catch (error) {
      console.error("Failed to submit form data:", error);
    }
  };

  return (
    <div>
      {(!id || formData) && (
        <Formik
          initialValues={defaultValues}
          validationSchema={basicSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, errors }) => (
            <Form>
              <Card title="General Information">
                <div className="row">
                  <div className="col-md-6">
                    {/* <SelectInput
                      label="Bank Name"
                      name="bank_name"
                      options={bankOptions}
                      required
                      onChange={(newValue) =>
                        setFieldValue("bank_name", newValue.value)
                      }
                    /> */}
                    <TextInput
                      label="Bank Name"
                      name="bank_name"
                      type="text"
                      placeholder="Enter Bank Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <TextInput
                      label="IFSC Code"
                      name="ifsc_code"
                      type="text"
                      placeholder="Enter IFSC Code"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <TextInput
                      label="Branch Name"
                      name="branch_name"
                      type="text"
                      placeholder="Enter Branch name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <TextInput
                      label="Account Holder Name"
                      name="account_holder_name"
                      type="text"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <SelectInput
                      label="Is Active"
                      name="is_active"
                      options={YES_NO}
                      onChange={(newValue, action) => {
                        if (action === "clear" || !newValue) {
                          setFieldValue("is_active", null); 
                        } else {
                          setFieldValue("is_active", newValue.value ? 1 : 0);
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    
                  </div>
                </div>
              </Card>

              <Card title="Address Information">
                <div className="row">
                  <div className="col-md-6">
                    <TextInput
                      label="Address Line 1"
                      name="bank_address_line_1"
                      type="text"
                      placeholder="Enter Address line 1"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <TextInput
                      label="Address Line 2"
                      name="bank_address_line_2"
                      type="text"
                      placeholder="Enter Address line 2"
                    />
                  </div>
                  <div className="col-md-4">
                    <SelectInput
                      label="Country"
                      name="bank_country"
                      options={countries}
                      required
                      onChange={(newValue, action) => {
                        if (action === "clear" || !newValue) {
                          setFieldValue("bank_country", "");
                          setFieldValue("bank_state", "");
                          setFieldValue("bank_city", "");
                        } else {
                          setFieldValue("bank_country", newValue.value);
                          dispatch(fetchStates(newValue.value));
                          dispatch(fetchCities(newValue.value));
                        }
                      }}
                      value={values.bank_country}
                    />
                  </div>
                  <div className="col-md-4">
                    <SelectInput
                      label="State"
                      name="bank_state"
                      options={states}
                      required
                      onChange={(newValue, action) => {
                        if (action === "clear" || !newValue) {
                          setFieldValue("bank_state", "");
                          setFieldValue("bank_city", "");
                        } else {
                          setFieldValue("bank_state", newValue.value);
                          dispatch(fetchCities(newValue.value));
                        }
                      }}
                      value={values.bank_state}
                    />
                  </div>
                  <div className="col-md-4">
                    <SelectInput
                      label="City"
                      name="bank_city"
                      options={cities}
                      required
                      onChange={(newValue) => {
                        setFieldValue(
                          "bank_city",
                          newValue ? newValue.value : ""
                        );
                      }}
                      value={values.bank_city}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      label="Pincode"
                      name="bank_pincode"
                      type="number"
                      placeholder="Enter pincode"
                      required
                    />
                  </div>
                </div>
              </Card>
              <Card title="Account Information">
                <div className="row">
                  <div className="col-md-4">
                  <TextInput
                      label="Account Number"
                      name="account_number"
                      type="number"
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                  <TextInput
                      label="Opening Credit Balance"
                      name="opening_credit_balance"
                      type="number"
                      placeholder="Enter opening credit balance"
                    />
                  </div>
                  <div className="col-md-4">
                  <TextInput
                      label="Opening Debit Balance"
                      name="opening_debit_balance"
                      type="number"
                      placeholder="Enter opening debit balance"
                    />
                  </div>
                  <div className="col-md-4">
                  <SelectInput
                      label="UPI Available"
                      name="is_upi_available"
                      options={YES_NO}
                      onChange={(newValue, action) => {
                        if (action === "clear" || !newValue) {
                          setFieldValue("is_upi_available", null);
                        } else {
                          setFieldValue("is_upi_available", newValue.value ? 1 : 0);
                        }
                      }}
                    />
                  </div>

                </div>
              </Card>

              <Button
                type="submit"
                // onClick={() => console.log("errors", errors)}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default BankForm;
