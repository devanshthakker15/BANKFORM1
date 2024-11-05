export interface Country {
    id: number;
    name: string;
  }
  
  export interface BankFormValues {
    bank_name: string;
    ifsc_code: string;
    branch_name: string;
    account_holder_name: string;
    account_number: string;
    opening_credit_balance: number;
    opening_debit_balance: number;
    is_upi_available: boolean;
    bank_address_line_1: string;
    bank_address_line_2?: string;
    bank_city: string;
    bank_state: string;
    bank_country: string | Country;  // Allow both string and Country in form
    bank_pincode: string;
    is_active: number;
    id?: number;
  }
  
  export interface BankData {
    id: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_country: Country;  // Require Country object for API data
    bank_state: string;
    bank_city: string;
    bank_pincode: string;
    opening_credit_balance: string;
    opening_debit_balance: string;
    is_upi_available: boolean;
    is_active: number;
    bank_address_line_1: string;
    bank_address_line_2?: string;
  }
  
  export interface FormData {
    id?: number;
    hsn_name: string;
    hsn_code: string;
    is_active: number;
  }