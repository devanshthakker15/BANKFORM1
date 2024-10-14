export const bankOptions = [
    { value: "Bank of Baroda", label: "Bank of Baroda" },
    { value: "HDFC Bank", label: "HDFC Bank" },
    { value: "ICICI Bank", label: "ICICI Bank" },
    { value: "IDFC First Bank", label: "IDFC First Bank" },
    { value: "Kotak Bank", label: "Kotak Bank" },
    { value: "SBI", label: "SBI" },
    { value: "Bank of Maharashtra", label: "Bank of Maharashtra" },
  ];
  
  export const countryOptions = [
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "Canada", label: "Canada" },
  ];
  
  export const stateCityMapping = {
    India: {
      states: [
        { value: "Maharashtra", label: "Maharashtra" },
        { value: "Gujarat", label: "Gujarat" },
      ],
      cities: {
        Maharashtra: [
          { value: "Mumbai", label: "Mumbai" },
          { value: "Pune", label: "Pune" },
        ],
        Gujarat: [
          { value: "Ahmedabad", label: "Ahmedabad" },
          { value: "Surat", label: "Surat" },
        ],
      },
    },
    USA: {
      states: [
        { value: "California", label: "California" },
        { value: "Texas", label: "Texas" },
      ],
      cities: {
        California: [
          { value: "Los Angeles", label: "Los Angeles" },
          { value: "San Francisco", label: "San Francisco" },
        ],
        Texas: [
          { value: "Houston", label: "Houston" },
          { value: "Austin", label: "Austin" },
        ],
      },
    },
    Canada: {
      states: [
        { value: "Ontario", label: "Ontario" },
        { value: "Quebec", label: "Quebec" },
      ],
      cities: {
        Ontario: [
          { value: "Toronto", label: "Toronto" },
          { value: "Ottawa", label: "Ottawa" },
        ],
        Quebec: [
          { value: "Montreal", label: "Montreal" },
          { value: "Quebec City", label: "Quebec City" },
        ],
      },
    },
  };