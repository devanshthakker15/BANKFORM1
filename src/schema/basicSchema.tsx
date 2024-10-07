import * as Yup from 'yup';

export const basicSchema = Yup.object({
  bankName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Bank name must contain only letters and spaces')
    .max(50, 'Bank name must be at most 50 characters long')
    .required('Bank name is required'),
  accountHolderName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Account holder name must contain only letters and spaces')
    .max(50, 'Account holder name must be at most 50 characters long')
    .required('Account holder name is required'),
  accountNumber: Yup.string()
    .matches(/^[0-9]{9,18}$/, 'Account number must be between 9 and 18 digits')
    .required('Account number is required'),
  addresses: Yup.array()
    .of(
      Yup.object({
        addressLine1: Yup.string()
          .min(10, 'Address Line 1 must be at least 10 characters long')
          .max(100, 'Address Line 1 must be at most 100 characters long')
          .required('Address Line 1 is required'),
        addressLine2: Yup.string().max(100, 'Address Line 2 must be at most 100 characters long'),
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
      })
    )
    .required('At least one address is required')
    .min(1, 'At least one address is required'),

    categoryName: Yup.string().required('Category Name is required'),
    categoryCode: Yup.string().required('Category Code is required'),
    categoryDescription: Yup.string().required('Category Description is required'),
    subCategory: Yup.string().required('Subcategory is required'),
});
