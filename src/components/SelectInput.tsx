import React from 'react';
import { useField } from 'formik';
import '../App.css';

interface Option {
  value: string; 
  label: string; 
}

interface SelectInputProps {
  label: string; 
  name: string; 
  options: Option[];
  required?: boolean; 
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Add optional onChange prop
  value?: string; // Add optional value prop
}

const SelectInput: React.FC<SelectInputProps> = ({ label, name, options, required = false, onChange, value }) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    helpers.setValue(value); // Set value in Formik
    if (onChange) {
      onChange(event); // Call custom onChange if provided
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="select-form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        {...field}
        className={`form-control input-size ${meta.touched && meta.error ? 'is-invalid' : ''}`} // Add invalid class on error
        id={name}
        required={required} // Add required attribute to select
        onChange={handleChange} // Use custom handleChange
        value={value || field.value} // Use provided value or the Formik field value
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default SelectInput;
