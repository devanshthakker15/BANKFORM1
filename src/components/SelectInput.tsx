import React from "react";
import Select from "react-select";
import { useField, FieldInputProps, FieldMetaProps, FieldHelperProps } from "formik";
import "../App.css";

interface Option {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  label: string;
  name: string;
  options: Option[];
  required?: boolean;
  onChange?: (value, action) => void; 
  value?:  Option;
  placeholder?: string 
}

const SelectInput: React.FC<SelectInputProps> = ({ label, name, options, required = false, onChange, value, placeholder }) => {
  const [field, meta, helpers]: [
    FieldInputProps<string | Option>, 
    FieldMetaProps<string | Option>,
    FieldHelperProps<string | Option>
  ] = useField(name);

  // Handle initial value correctly
  const initialValue = value || options.find(option => option.value === field.value);

  return (
    <div className="form-group">
      <label htmlFor={name} className="select-form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <Select
        className={`react-select-container ${meta.touched && meta.error ? "is-invalid" : ""}`}
        classNamePrefix="react-select"
        name={name}
        value={initialValue} // Use the initialValue here
        options={options}
        onChange={onChange}
        isClearable 
        placeholder="Select an option"
      />
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default SelectInput;