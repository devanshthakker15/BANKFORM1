import React from 'react';
import { Field, ErrorMessage } from 'formik';
import "../styles/bankStyles.css";

interface TextInputProps {
  label: string; 
  name: string; 
  type?: string; 
  placeholder?: string; 
  required?: boolean; 
}

const TextInput: React.FC<TextInputProps> = ({ label, name, type = "text", placeholder, required = false }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="text-form-label">
        {label} {required && <span className="text-danger">*</span>} 
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="form-control input-size"
      />
      <ErrorMessage name={name} component="div" className="text-danger" />
    </div>
  );
};

export default TextInput;
