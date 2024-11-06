import * as Yup from "yup";

export const employeeSchema = Yup.object({
  name: Yup.string()
    .max(50, "Name must be at most 50 characters long")
    .required("Name is required"),
  username: Yup.string()
    .max(50, "Username must be at most 50 characters long")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  company_name: Yup.string()
    .max(50, "Company name must be at most 50 characters long")
    .required("Company name is required"),
});
