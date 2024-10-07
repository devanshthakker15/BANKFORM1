import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface TextInputProps {
  label: string; 
  name: string; 
  type?: string; 
  placeholder?: string; 
}

const TextInput: React.FC<TextInputProps> = ({ label, name, type = "text", placeholder }) => {
  return (
    <div className="mb-1 mt-2">
      <label htmlFor={name} className="form-label">{label}</label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="form-control"
      />
      <ErrorMessage name={name} component="div" className="text-danger" />
    </div>
  );
};

export default TextInput;
