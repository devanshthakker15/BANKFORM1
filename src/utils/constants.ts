
export const BASE_URL = process.env.REACT_APP_API

export const bankOptions = [
  { value: "Bank of Baroda", label: "Bank of Baroda" },
  { value: "HDFC Bank", label: "HDFC Bank" },
  { value: "ICICI Bank", label: "ICICI Bank" },
  { value: "IDFC First Bank", label: "IDFC First Bank" },
  { value: "Kotak Bank", label: "Kotak Bank" },
  { value: "SBI", label: "SBI" },
  { value: "IDBI Bank", label: "IDBI Bank" },
  { value: "DCB Bank", label: "DCB Bank" },
  { value: "TJSB Bank", label: "TJSB Bank" },
  { value: "Axis Bank", label: "Axis Bank" },
  { value: "Bank Of India", label: "Bank Of India" },
  { value: "Bank of Maharashtra", label: "Bank of Maharashtra" },
  { value: "Union Bank", label: "Union Bank"},
  { value: "Canera Bank", label: "Canera Bank" },
  { value: "Central Bank of India", label: "Central Bank of India" },

];

export const YES_NO =[
  {value: 1, label:"Yes"},
  {value: 0, label: "No"}
  ];

  
// Define the array of module names to exclude
export const EXCLUDED_MODULES = ["Manage Locations", "Manage Roles", null
  // "Manage Product Category", "Manage Customer", "Manage Product Brands", "Manage UOM", "Manage Product Tax", "Manage Payment Term", "Manage Payment Mode", "Manage Product Sub Category", "Manage Product Groups",  "Manage Orders", "Cancel Order", "Manage Returns/Refunds", "Manage Hold Bill", "Manage Branches/Store", 
  ]; 

 // Permission constants
export const PERMISSIONS = {
  VIEW: 'perm_view',
  ADD: 'perm_add',
  UPDATE: 'perm_edit',
  DELETE: 'perm_delete'
};
 






// export const countries = [
//   { id: 1, value: "India", label: "India" },
//   { id: 2, value: "USA", label: "USA" },
//   { id: 3, value: "Canada", label: "Canada" },  
//   { id: 4, value: "Australia", label: "Australia" },
//   { id: 5, value: "Brazil", label: "Brazil" },
// ];

// export const states = [
//   { id: 1, value: "Maharashtra", label: "Maharashtra", countryId: 1 },
//   { id: 2, value: "Gujarat", label: "Gujarat", countryId: 1 },
//   { id: 3, value: "California", label: "California", countryId: 2 },
//   { id: 4, value: "Texas", label: "Texas", countryId: 2 },
//   { id: 5, value: "Ontario", label: "Ontario", countryId: 3 },
//   { id: 6, value: "Quebec", label: "Quebec", countryId: 3 },
//   { id: 7, value: "Victoria", label: "Victoria", countryId: 4 },
//   { id: 8, value: "Queensland", label: "Queensland", countryId: 4 },
//   { id: 9, value: "Tasmania", label: "Tasmania", countryId: 4 },
//   { id: 10, value: "Rio de Janeiro", label: "Rio de Janeiro", countryId: 5 },
//   { id: 11, value: "São Paulo", label: "São Paulo", countryId: 5 },
// ];

// export const cities = [
//   // Cities in Maharashtra
//   { id: 1, value: "Mumbai", label: "Mumbai", stateId: 1 },
//   { id: 2, value: "Pune", label: "Pune", stateId: 1 },
//   { id: 3, value: "Mulund", label: "Mulund", stateId: 1 },
//   { id: 4, value: "Bhandup", label: "Bhandup", stateId: 1 },
//   { id: 5, value: "Thane", label: "Thane", stateId: 1 },

//   // Cities in Gujarat
//   { id: 6, value: "Ahmedabad", label: "Ahmedabad", stateId: 2 },
//   { id: 7, value: "Surat", label: "Surat", stateId: 2 },
//   { id: 8, value: "Vadodara", label: "Vadodara", stateId: 2 },

//   // Cities in California
//   { id: 9, value: "Los Angeles", label: "Los Angeles", stateId: 3 },
//   { id: 10, value: "San Francisco", label: "San Francisco", stateId: 3 },

//   // Cities in Texas
//   { id: 11, value: "Houston", label: "Houston", stateId: 4 },
//   { id: 12, value: "Austin", label: "Austin", stateId: 4 },

//   // Cities in Ontario
//   { id: 13, value: "Toronto", label: "Toronto", stateId: 5 },
//   { id: 14, value: "Ottawa", label: "Ottawa", stateId: 5 },

//   // Cities in Quebec
//   { id: 15, value: "Montreal", label: "Montreal", stateId: 6 },
//   { id: 16, value: "Quebec City", label: "Quebec City", stateId: 6 },

//   //Cities in Victoria
//   { id: 17, value: "Melbourne", label: "Melbourne", stateId: 7 },
//   { id: 18, value: "Geelong", label: "Geelong", stateId: 7 },

//   //Cities in Queensland
//   { id: 19, value: "Brisbane", label: "Brisbane", stateId: 8 },
//   { id: 20, value: "Gold Coast", label: "Gold Coast", stateId: 8 },

//   //Cities in Tasmania
//   { id: 21, value: "Hobart", label: "Hobart", stateId: 9 },
//   { id: 22, value: "Burnie", label: "Burnie", stateId: 9 },

//   //Cities in Rio de Janeiro
//   { id: 23, value: "Rio de Janeiro", label: "Rio de Janeiro", stateId: 10 },
//   { id: 24, value: "Petrópolis", label: "Petrópolis", stateId: 10 },

//   //Cities in São Paulo
//   { id: 25, value: "São Paulo", label: "São Paulo", stateId: 11 },
//   { id: 26, value: "Santos", label: "Santos", stateId: 11 },
// ];






// export const BASE_URL = "https://07dlmd6jpi.execute-api.ap-south-1.amazonaws.com/dev";
export const USER_URL="https://jsonplaceholder.typicode.com"

export const PRODUCTS_URL="https://fakestoreapi.com/products"