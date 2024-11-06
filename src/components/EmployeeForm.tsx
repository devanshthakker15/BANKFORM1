import React, { useState, useMemo } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import TextInput from "./TextInput"; // Assuming you have a TextInput component
import Card from "./Card"; // Assuming you have a Card component
import { employeeSchema } from "../schema/employeeSchema";
// import { Breadcrumb } from "react-bootstrap";
import Breadcrumb from "./Breadcrumb";

interface EmployeeFormProps {
  initialValues?: {
    name: string;
    username: string;
    email: string;
    company_name: string;
  };
}



const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialValues }) => {
  const [formData, setFormData] = useState<
    EmployeeFormProps["initialValues"] | null
  >(initialValues || null);

  const defaultValues = useMemo(
    () =>
      formData || {
        name: "",
        username: "",
        email: "",
        company_name: "",
      },
    [formData]
  );

  const handleSubmit = async (values: EmployeeFormProps["initialValues"]) => {
    try {
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
        <h2>Add Employee Details</h2>
      </div>
      <Formik
        initialValues={defaultValues}
        validationSchema={employeeSchema} 
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values }) => (
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
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
    </div>
  );
};

export default EmployeeForm;