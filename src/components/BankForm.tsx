import React, { useState, useMemo, useEffect } from "react";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import { useAppDispatch } from "../redux/hooks";
import { saveFormDataAsync } from "../redux/formSlice";
import { basicSchema } from "../schema/basicSchema";
import Card from "./Card";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { bankOptions, countries, states, cities } from "../utils/constants";
import "../styles/bankStyles.css";

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
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New state for submission loading
  const [isCorrupted, setIsCorrupted] = useState<boolean>(false);

  useEffect(() => {
    if (initialValues && initialValues.addresses.length > 0) {
      setSelectedCountry(initialValues.addresses[0].country);
      setSelectedState(initialValues.addresses[0].state);
    }
  }, [initialValues]);

  const handleNavigation = (path: string) => {
    // Get the last segment of the path
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (!isNaN(Number(lastSegment))) {
      const basePath = pathSegments.slice(0, -1).join("/");
      const newPath = `${basePath}${path}`;
      navigate(newPath);
    } else {
      navigate(path);
    }
  };

  const defaultValues = useMemo(() => {
    return (
      initialValues || {
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
      await dispatch(saveFormDataAsync(values));
      resetForm();
      navigate("/banks");
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setIsSubmitting(false); // End loader
    }
  };

  // Helper functions to get filtered state and city options based on selections
  const getStateOptions = () => {
    return states.filter(
      (state) =>
        state.countryId ===
        countries.find((country) => country.value === selectedCountry)?.id
    );
  };

  const getCityOptions = () => {
    return cities.filter(
      (city) =>
        city.stateId ===
        states.find((state) => state.value === selectedState)?.id
    );
  };

  // Check for corrupted data
  const checkForCorruptedData = (data: BankFormValues) => {
    const requiredFields = [
      data.bankName,
      data.ifscCode,
      data.branchName,
      data.accountHolderName,
      data.accountNumber,
      data.email,
    ];

    const addressFields = data.addresses.every(
      (address) =>
        address.addressLine1 &&
        address.city &&
        address.state &&
        address.country &&
        address.pincode
    );

    return requiredFields.every((field) => field) && addressFields;
  };

  useEffect(() => {
    if (initialValues && !checkForCorruptedData(initialValues)) {
      setIsCorrupted(true); // Mark as corrupted if data is incomplete
    }
  }, [initialValues]);

  if (isCorrupted) {
    return (
      <div className="alert alert-danger">
        <h4>Data Corrupted</h4>
        <p>
          Sorry for the inconvenience. The data you are trying to edit is
          corrupted or missing. Please contact support or try again.
        </p>
      </div>
    );
  }

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
                    options={bankOptions}
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
                              options={countries}
                              required={true}
                              onChange={(e) => {
                                setSelectedCountry(e.target.value);
                                setSelectedState("");
                              }}
                              value={address.country}
                            />
                          </div>
                          <div className="col-md-3">
                            <SelectInput
                              label="State"
                              name={`addresses.${index}.state`}
                              options={getStateOptions()}
                              required={true}
                              onChange={(e) => setSelectedState(e.target.value)}
                              value={address.state}
                            />
                          </div>
                          <div className="col-md-3">
                            <SelectInput
                              label="City"
                              name={`addresses.${index}.city`}
                              options={getCityOptions()}
                              required={true}
                              value={address.city}
                            />
                          </div>
                          <div className="col-md-3">
                            <TextInput
                              label="Pincode"
                              placeholder="Enter Pincode"
                              name={`addresses.${index}.pincode`}
                              required={true}
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
                            Add Address
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
                    placeholder="Enter Email"
                    name="email"
                    required={true}
                  />
                </div>
              </div>
            </Card>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="submit"
                className="btn btn-primary custom-button"
                disabled={isSubmitting}
                // onClick={() => handleNavigation("/bank-details-list")}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>


              {/* <button
                onClick={() => handleNavigation("/bank-details-list")}
                className="btn btn-secondary"
              >
                View Details List
              </button> */}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BankForm;