import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectInput from "../components/SelectInput";
import { Formik } from "formik";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
];

const initialValues = {
  testField: "",
};

describe("SelectInput Component", () => {
  const renderComponent = (props = {}) => {
    return render(
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <SelectInput
          label="Test Field"
          name="testField"
          options={mockOptions}
          {...props}
        />
      </Formik>
    );
  };

  it("should render without crashing", () => {
    renderComponent();
    const labelElement = screen.getByText("Test Field");
    expect(labelElement).toBeInTheDocument();
  });

  it("should display required asterisk when required prop is true", () => {
    renderComponent({ required: true });
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
  });

  it("should display the correct placeholder", () => {
    renderComponent();
    const placeholder = screen.getByText("Select an option");
    expect(placeholder).toBeInTheDocument();
  });

  it("should show the correct initial value when passed", () => {
    renderComponent({ value: "option1" });
    const selectedOption = screen.getByText("Option 1");
    expect(selectedOption).toBeInTheDocument();
  });

  it("should display error message when the field is invalid", () => {
    const renderComponentWithValidationError = () => {
      return render(
        <Formik
          initialValues={initialValues}
          onSubmit={jest.fn()}
          initialErrors={{ testField: "Field is required" }}
          initialTouched={{ testField: true }}
        >
          <SelectInput
            label="Test Field"
            name="testField"
            options={mockOptions}
          />
        </Formik>
      );
    };

    renderComponentWithValidationError();
    const errorMessage = screen.getByText("Field is required");
    expect(errorMessage).toBeInTheDocument();
  });
});
