import * as Yup from 'yup';

export const basicSchema = Yup.object({
  bankName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Bank name must contain only letters and spaces')
    .max(50, 'Bank name must be at most 50 characters long')
    .required('Bank name is required'),
  
  ifscCode: Yup.string()
    .length(11, 'IFSC code must be exactly 11 characters')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
    .required('IFSC code is required'),
  
  branchName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Branch name must contain only letters and spaces')
    .max(50, 'Branch name must be at most 50 characters long')
    .required('Branch name is required'),

  addressLine1: Yup.string()
    .min(10, 'Address Line 1 must be at least 10 characters long')
    .max(100, 'Address Line 1 must be at most 100 characters long')
    .required('Address Line 1 is required'),

  addressLine2: Yup.string()
    .max(100, 'Address Line 2 must be at most 100 characters long'),

  city: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'City name must contain only letters and spaces')
    .max(50, 'City name must be at most 50 characters long')
    .required('City is required'),

  state: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'State name must contain only letters and spaces')
    .max(50, 'State name must be at most 50 characters long')
    .required('State is required'),

  country: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Country name must contain only letters and spaces')
    .max(50, 'Country name must be at most 50 characters long')
    .required('Country is required'),

  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits')
    .required('Pincode is required'),

  accountHolderName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Account holder name must contain only letters and spaces')
    .max(50, 'Account holder name must be at most 50 characters long')
    .required('Account holder name is required'),

  accountNumber: Yup.string()
    .matches(/^[0-9]{9,18}$/, 'Account number must be between 9 and 18 digits')
    .required('Account number is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

// type TBank = Yup.InferType(basicSchema)