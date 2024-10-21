import React from "react";
import Select from "react-select";
import { useField, FieldInputProps, FieldMetaProps, FieldHelperProps } from "formik";
import "../App.css";

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  name: string;
  options: Option[];
  required?: boolean;
  onChange?: (option: Option | null) => void; 
  value?: string; 
}

const SelectInput: React.FC<SelectInputProps> = ({ label, name, options, required = false, onChange, value }) => {
  const [field, meta, helpers]: [
    FieldInputProps<string>,
    FieldMetaProps<string>,
    FieldHelperProps<string>
  ] = useField(name);

  const handleChange = (option: Option | null) => {
    const selectedValue = option ? option.value : "";
    helpers.setValue(selectedValue); 
    if (onChange) {
      onChange(option); 
    }
  };

  const selectedOption = options.find((option) => option.value === value || option.value === field.value);

  return (
    <div className="form-group">
      <label htmlFor={name} className="select-form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <Select
        className={`react-select-container ${meta.touched && meta.error ? "is-invalid" : ""}`}
        classNamePrefix="react-select"
        name={name}
        value={selectedOption}
        options={options}
        onChange={handleChange}
        isClearable // Allows clearing the selection
        placeholder="Select an option"
      />
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default SelectInput;


