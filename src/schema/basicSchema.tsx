import * as Yup from 'yup';

export const basicSchema = Yup.object({
  bank_name: Yup.string()
    .max(50, 'Bank name must be at most 50 characters long')
    .required('Bank name is required'),

  ifsc_code: Yup.string()
    .length(11, "IFSC Code must be exactly 11 characters long")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format. It must start with four uppercase letters followed by a '0', and then six alphanumeric characters.")
    .required("IFSC Code is required"),

  branch_name: Yup.string()
    .max(50, 'Branch name must be at most 50 characters long')
    .required('Branch name is required'),

  account_holder_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Account holder name must contain only letters and spaces')
    .max(50, 'Account holder name must be at most 50 characters long')
    .required('Account holder name is required'),

  account_number: Yup.string()
    .min(9, 'Account number must be at least 9 digits')
    .max(18, 'Account number cannot exceed 18 digits')
    .required('Account number is required'),

  opening_credit_balance: Yup.number()
    .typeError('Opening Credit Balance must be a number')
    .min(0, 'Opening Credit Balance cannot be negative')
    .required('Opening Credit Balance is required'),

  opening_debit_balance: Yup.number()
    .typeError('Opening Debit Balance must be a number')
    .min(0, 'Opening Debit Balance cannot be negative')
    .required('Opening Debit Balance is required'),

  is_upi_available: Yup.boolean()
    .required('UPI availability must be specified'),

  bank_address_line_1: Yup.string()
    .max(100, 'Address Line 1 must be at most 100 characters long')
    .required('Address Line 1 is required'),

  bank_address_line_2: Yup.string()
    .max(100, 'Address Line 2 must be at most 100 characters long'),

  bank_city: Yup.string()
    // .matches(/^[A-Za-z\s]+$/, 'City name must contain only letters and spaces')
    .max(50, 'City name must be at most 50 characters long')
    .required('City is required'),  

  bank_state: Yup.string()
    // .matches(/^[A-Za-z\s]+$/, 'State name must contain only letters and spaces')
    .max(50, 'State name must be at most 50 characters long')
    .required('State is required'),

  bank_country: Yup.string()
    // .matches(/^[A-Za-z\s]+$/, 'Country name must contain only letters and spaces')
    .max(50, 'Country name must be at most 50 characters long')
    .required('Country is required'),

  bank_pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits')
    .required('Pincode is required'),

  is_active: Yup.number()
    .required('Active status must be specified'),
});