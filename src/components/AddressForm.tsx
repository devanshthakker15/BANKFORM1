import React from 'react';
import { FieldArray, Field, ErrorMessage } from 'formik';

interface AddressFormProps {
  addresses: any[];
}

const AddressForm: React.FC<AddressFormProps> = ({ addresses }) => {
  return (
    <FieldArray name="addresses">
      {({ push, remove }) => (
        <div>
          {addresses.map((_, index) => (
            <div key={index}>
              <h4>Address {index + 1}</h4>
              <div>
                <label htmlFor={`addresses.${index}.addressLine1`}>Address Line 1</label>
                <Field name={`addresses.${index}.addressLine1`} />
                <ErrorMessage name={`addresses.${index}.addressLine1`} component="div" />
              </div>
              <div>
                <label htmlFor={`addresses.${index}.addressLine2`}>Address Line 2</label>
                <Field name={`addresses.${index}.addressLine2`} />
                <ErrorMessage name={`addresses.${index}.addressLine2`} component="div" />
              </div>
              <div>
                <label htmlFor={`addresses.${index}.city`}>City</label>
                <Field name={`addresses.${index}.city`} />
                <ErrorMessage name={`addresses.${index}.city`} component="div" />
              </div>
              <div>
                <label htmlFor={`addresses.${index}.state`}>State</label>
                <Field name={`addresses.${index}.state`} />
                <ErrorMessage name={`addresses.${index}.state`} component="div" />
              </div>
              <div>
                <label htmlFor={`addresses.${index}.country`}>Country</label>
                <Field name={`addresses.${index}.country`} />
                <ErrorMessage name={`addresses.${index}.country`} component="div" />
              </div>
              <div>
                <label htmlFor={`addresses.${index}.pincode`}>Pincode</label>
                <Field name={`addresses.${index}.pincode`} />
                <ErrorMessage name={`addresses.${index}.pincode`} component="div" />
              </div>
              <button type="button" onClick={() => remove(index)}>Remove Address</button>
            </div>
          ))}
          <button type="button" onClick={() => push({ addressLine1: '', addressLine2: '', city: '', state: '', country: '', pincode: '' })}>
            Add Address
          </button>
        </div>
      )}
    </FieldArray>
  );
};

export default AddressForm;
