import * as Yup from "yup";

export const offcanvasSchema = Yup.object({
  hsn_name: Yup.string()
    .max(50, "HSN name must be at most 50 characters long")
    .required("HSN name is required"),

  hsn_code: Yup.string()
    .matches(/^[0-9]+$/, "HSN code must contain only numbers")
    .min(2, "HSN code must be at least 2 digits long")
    .max(8, "HSN code must be at most 8 digits long")
    .required("HSN code is required"),

  is_active: Yup.number()
  .required("Active status must be specified"),
});
