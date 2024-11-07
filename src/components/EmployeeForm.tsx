import React, { useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import Card from "./Card";
import { employeeSchema } from "../schema/employeeSchema";
import Breadcrumb from "./Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../redux/store";
import { fetchEmployeeByIdAsync } from "../redux/employeeSlice";
import axios from "axios";

interface EmployeeFormProps {
  initialValues?: {
    name: string;
    username: string;
    email: string;
    company_name: string;
  };
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialValues }) => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const selectedEmployee = useSelector((state: RootState) => state.employee.selectedEmployee);

  // Fetch employee details if editing (i.e., if an ID is present)
  useEffect(() => {
    if (id) {
      console.log(`Fetching employee data for ID: ${id}`);
      dispatch(fetchEmployeeByIdAsync(Number(id)));
    }
  }, [dispatch, id]);

  // UseMemo to create form initial values based on selectedEmployee data
  const formInitialValues = useMemo(
    () => ({
      name: selectedEmployee?.name || "",
      username: selectedEmployee?.username || "",
      email: selectedEmployee?.email || "",
      company_name: selectedEmployee?.company_name || "",
    }),
    [selectedEmployee]
  );

  // Log to verify selectedEmployee data and formInitialValues
  console.log("Selected Employee Data:", selectedEmployee);
  console.log("Form Initial Values:", formInitialValues);

  // Form submission handler
  const handleSubmit = async (values: EmployeeFormProps["initialValues"]) => {
    try {
      console.log("Form submitted with values:", values);
      const response = await axios.post(`{USER_URL}/users`, values);
      console.log("Employee data submitted successfully:", response.data);
    } catch (error) {
      console.error("Failed to submit employee data:", error);
    }
  };

  return (
    <div>
      <Breadcrumb />
      <div className="container">
        <div className="header mb-2">
          <h2>{id ? "Edit Employee Details" : "Add Employee Details"}</h2>
        </div>
        <Formik
          initialValues={formInitialValues}
          validationSchema={employeeSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form>
            <Card title="Employee Information">
              <div className="row">
                <div className="col-md-6">
                  <TextInput
                    label="Name"
                    name="name"
                    placeholder="Enter employee name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Username"
                    name="username"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <TextInput
                    label="Email"
                    name="email"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <TextInput
                    label="Company Name"
                    name="company_name"
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>
            </Card>
            <button type="submit" className="btn btn-primary mt-4">
              {id ? "Update" : "Submit"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeForm;
