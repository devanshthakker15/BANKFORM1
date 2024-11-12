import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import BankForm from "../components/BankForm";
import locationReducer from "../redux/locationSlice";
import formReducer from "../redux/formSlice";
import { submitBankDataAsync } from "../redux/formSlice";

jest.mock("../redux/formSlice", () => ({
  submitBankDataAsync: jest.fn(),
}));

const renderWithProviders = (component: JSX.Element) => {
  const store = configureStore({
    reducer: {
      location: locationReducer,
      form: formReducer,
    },
  });
  
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/banks/edit/42"]}>
        <Route path="/banks/edit/:id">{component}</Route>
      </MemoryRouter>
    </Provider>
  );
};

describe("BankForm Component", () => {
  const initialValues = {
    bank_name: "Test Bank",
    ifsc_code: "TEST0001234",
    branch_name: "Test Branch",
    account_holder_name: "John Doe",
    account_number: "1234567890",
    opening_credit_balance: 1000,
    opening_debit_balance: 500,
    is_upi_available: 1,
    bank_address_line_1: "123 Test St",
    bank_address_line_2: "Suite 200",
    bank_city: { id: 1, name: "Test City" },
    bank_state: { id: 1, name: "Test State" },
    bank_country: { id: 1, name: "Test Country" },
    bank_pincode: "123456",
    is_active: 1,
  };




  it("renders with initial values correctly", async() => {
    renderWithProviders(<BankForm initialValues={initialValues} />);

    await waitFor(() => {
        expect(screen.getByLabelText(/Bank Name/i)).toHaveValue("Test Bank");
        expect(screen.getByLabelText(/IFSC Code/i)).toHaveValue("TEST0001234");
        expect(screen.getByLabelText(/Branch Name/i)).toHaveValue("Test Branch");
        expect(screen.getByLabelText(/Account Holder Name/i)).toHaveValue("John Doe");
        expect(screen.getByLabelText(/Account Number/i)).toHaveValue("1234567890");
        expect(screen.getByLabelText(/Opening Credit Balance/i)).toHaveValue(1000);
        expect(screen.getByLabelText(/Opening Debit Balance/i)).toHaveValue(500);
        expect(screen.getByLabelText(/Address Line 1/i)).toHaveValue("123 Test St");
        expect(screen.getByLabelText(/Address Line 2/i)).toHaveValue("Suite 200");
        expect(screen.getByLabelText(/Pincode/i)).toHaveValue("123456");
      });
  });




  it("displays validation errors when required fields are empty", async () => {
    renderWithProviders(<BankForm />);

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/Bank Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/IFSC Code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Account Holder Name is required/i)).toBeInTheDocument();
    });
  });




  it("submits form data successfully with correct values", async () => {
    renderWithProviders(<BankForm initialValues={initialValues} />);

    fireEvent.change(screen.getByLabelText(/Bank Name/i), { target: { value: "Updated Bank" } });
    fireEvent.change(screen.getByLabelText(/IFSC Code/i), { target: { value: "UPDT0005678" } });
    fireEvent.change(screen.getByLabelText(/Account Holder Name/i), { target: { value: "Jane Doe" } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(submitBankDataAsync).toHaveBeenCalledWith({
        values: expect.objectContaining({
          bank_name: "Updated Bank",
          ifsc_code: "UPDT0005678",
          account_holder_name: "Jane Doe",
        }),
        id: "42",
      });
    });
  });




  it("resets state and city fields when country is changed", async () => {
    renderWithProviders(<BankForm initialValues={initialValues} />);

    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "New Country" } });

    await waitFor(() => {
      expect(screen.getByLabelText(/State/i)).toHaveValue("");
      expect(screen.getByLabelText(/City/i)).toHaveValue("");
    });
  });





  it("displays correct options in dropdowns", async () => {
    renderWithProviders(<BankForm />);

    await waitFor(() => {
      expect(screen.getByText(/Country/i)).toBeInTheDocument();
      expect(screen.getByText(/State/i)).toBeInTheDocument();
      expect(screen.getByText(/City/i)).toBeInTheDocument();
    });
  });
});
