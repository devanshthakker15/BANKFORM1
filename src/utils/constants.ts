export const bankOptions = [
  { value: "Bank of Baroda", label: "Bank of Baroda" },
  { value: "HDFC Bank", label: "HDFC Bank" },
  { value: "ICICI Bank", label: "ICICI Bank" },
  { value: "IDFC First Bank", label: "IDFC First Bank" },
  { value: "Kotak Bank", label: "Kotak Bank" },
  { value: "SBI", label: "SBI" },
  { value: "Bank of Maharashtra", label: "Bank of Maharashtra" },
];

export const countries = [
  { id: 1, value: "India", label: "India" },
  { id: 2, value: "USA", label: "USA" },
  { id: 3, value: "Canada", label: "Canada" },
];

export const states = [
  { id: 1, value: "Maharashtra", label: "Maharashtra", countryId: 1 },
  { id: 2, value: "Gujarat", label: "Gujarat", countryId: 1 },
  { id: 3, value: "California", label: "California", countryId: 2 },
  { id: 4, value: "Texas", label: "Texas", countryId: 2 },
  { id: 5, value: "Ontario", label: "Ontario", countryId: 3 },
  { id: 6, value: "Quebec", label: "Quebec", countryId: 3 },
];

export const cities = [
  // Cities in Maharashtra
  { id: 1, value: "Mumbai", label: "Mumbai", stateId: 1 },
  { id: 2, value: "Pune", label: "Pune", stateId: 1 },
  { id: 3, value: "Mulund", label: "Mulund", stateId: 1 },
  { id: 4, value: "Bhandup", label: "Bhandup", stateId: 1 },
  { id: 5, value: "Thane", label: "Thane", stateId: 1 },

  // Cities in Gujarat
  { id: 6, value: "Ahmedabad", label: "Ahmedabad", stateId: 2 },
  { id: 7, value: "Surat", label: "Surat", stateId: 2 },
  { id: 8, value: "Vadodara", label: "Vadodara", stateId: 2 },

  // Cities in California
  { id: 9, value: "Los Angeles", label: "Los Angeles", stateId: 3 },
  { id: 10, value: "San Francisco", label: "San Francisco", stateId: 3 },

  // Cities in Texas
  { id: 11, value: "Houston", label: "Houston", stateId: 4 },
  { id: 12, value: "Austin", label: "Austin", stateId: 4 },

  // Cities in Ontario
  { id: 13, value: "Toronto", label: "Toronto", stateId: 5 },
  { id: 14, value: "Ottawa", label: "Ottawa", stateId: 5 },

  // Cities in Quebec
  { id: 15, value: "Montreal", label: "Montreal", stateId: 6 },
  { id: 16, value: "Quebec City", label: "Quebec City", stateId: 6 },
];