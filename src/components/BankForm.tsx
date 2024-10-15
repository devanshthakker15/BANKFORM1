import React, { useState, useMemo, useEffect } from "react";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { useAppDispatch } from "../redux/hooks";  // Import the new hook
import { saveFormDataAsync } from "../redux/formSlice";
import { basicSchema } from "../schema/basicSchema";
import Card from "./Card";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { bankOptions, countryOptions, stateCityMapping } from "../utils/constants";  // Import updated constants

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface BankFormValues {
  bankName: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
  accountNumber: string;
  email: string;
  addresses: Address[];
  id?: number;
}

interface Option {
  value: string;
  label: string;
}

interface BankFormProps {
  initialValues?: BankFormValues; 
}

const BankForm: React.FC<BankFormProps> = ({ initialValues }) => {
  const dispatch = useAppDispatch(); // Now using useAppDispatch instead of AppDispatch
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  // Set selectedCountry and selectedState from initialValues when form is in edit mode
  useEffect(() => {
    if (initialValues && initialValues.addresses.length > 0) {
      setSelectedCountry(initialValues.addresses[0].country);
      setSelectedState(initialValues.addresses[0].state);
    }
  }, [initialValues]);

  const defaultValues = useMemo(() => {
    return initialValues || {
      bankName: "",
      ifscCode: "",
      branchName: "",
      accountHolderName: "",
      accountNumber: "",
      email: "",
      addresses: [
        {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        },
      ],
    };
  }, [initialValues]);

  const onSubmit = async (
    values: BankFormValues,
    { resetForm }: FormikHelpers<BankFormValues>
  ) => {
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
      await dispatch(saveFormDataAsync(values));
      resetForm();
      navigate("/bank-details-list");
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const getStateOptions = () => {
    return selectedCountry ? stateCityMapping[selectedCountry].states : [];
  };

  const getCityOptions = () => {
    return selectedState ? stateCityMapping[selectedCountry].cities[selectedState] : [];
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
                    name="bankName"
                    options={bankOptions}   // Use imported options
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="IFSC Code"
                    placeholder="Enter IFSC code"
                    name="ifscCode"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Branch Name"
                    placeholder="Enter Branch name"
                    name="branchName"
                    required={true}
                  />
                </div>
              </div>
            </Card>

            <FieldArray name="addresses">
              {({ remove, push }) => (
                <Card title="Address Information">
                  {values.addresses.length > 0 &&
                    values.addresses.map((address, index) => (
                      <div key={index}>
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <TextInput
                              label="Address Line 1"
                              placeholder="Enter Address"
                              name={`addresses.${index}.addressLine1`}
                              required={true}
                            />
                          </div>
                          <div className="col-md-6">
                            <TextInput
                              label="Address Line 2"
                              placeholder="Enter Address"
                              name={`addresses.${index}.addressLine2`}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <SelectInput
                              label="Country"
                              name={`addresses.${index}.country`}
                              options={countryOptions}  // Use imported options
                              required={true}
                              onChange={(e) => {
                                setSelectedCountry(e.target.value);
                                setSelectedState("");
                              }}
                              value={address.country}  // Set the selected country
                            />
                          </div>
                          <div className="col-md-3">
                            <SelectInput
                              label="State"
                              name={`addresses.${index}.state`}
                              options={getStateOptions()}    // Dynamically filtered states
                              required={true}
                              onChange={(e) => setSelectedState(e.target.value)}
                              value={address.state}  // Set the selected state
                            />
                          </div>
                          <div className="col-md-3">
                            <SelectInput
                              label="City"
                              name={`addresses.${index}.city`}
                              options={getCityOptions()}     // Dynamically filtered cities
                              required={true}
                              value={address.city}  // Set the selected city
                            />
                          </div>
                          <div className="col-md-3">
                            <TextInput
                              label="Pincode"
                              placeholder="Enter Pincode"
                              name={`addresses.${index}.pincode`}
                              required={true}
                              // value={address.pincode}  // Set the pincode
                            />
                          </div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <button
                            type="button"
                            className="btn btn-primary mt-2"
                            onClick={() =>
                              push({
                                addressLine1: "",
                                addressLine2: "",
                                city: "",
                                state: "",
                                country: "",
                                pincode: "",
                              })
                            }
                          >
                            Add Another Address
                          </button>
                          {values.addresses.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger mt-2"
                              onClick={() => remove(index)}
                            >
                              Remove Address
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </Card>
              )}
            </FieldArray>

            <Card title="Customer Information">
              <div className="row">
                <div className="col-md-6">
                  <TextInput
                    label="Account Holder Name"
                    placeholder="Enter Account Holder Name"
                    name="accountHolderName"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Account Number"
                    placeholder="Enter Account Number"
                    name="accountNumber"
                    required={true}
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Email"
                    placeholder="Enter Email Address"
                    name="email"
                    required={true}
                    type="email"
                  />
                </div>
              </div>
            </Card>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success mt-2">
                Submit
              </button>
              <Link to="/bank-details-list">
                <button type="button" className="btn btn-primary mt-2">
                  Go to Bank Details List
                </button>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BankForm;
