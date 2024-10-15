interface PermissionUser {
    id: number;
    username: string;
    password: string;
    email: string;
    userType: string;
    permissions: string[];
  }
  
  const perms: PermissionUser[] = [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "userType": "normal",
      "permissions": ["home"]
    },
    {
      "id": 2,
      "username": "jane_smith",
      "email": "jane.smith@example.com",
      "password": "password456",
      "userType": "customer",
      "permissions": ["home", "form"]
    },
    {
      "id": 3,
      "username": "admin_jones",
      "email": "admin.jones@example.com",
      "password": "admin789",
      "userType": "admin",
      "permissions": ["home", "form", "viewDetails"]
    },
    {
      "id": 4,
      "username": "michael_roberts",
      "email": "michael.roberts@example.com",
      "password": "pass1234",
      "userType": "normal",
      "permissions": ["home"]
    },
    {
      "id": 5,
      "username": "karen_hall",
      "email": "karen.hall@example.com",
      "password": "cust5678",
      "userType": "customer",
      "permissions": ["home", "form"]
    },
    {
      "id": 6,
      "username": "admin_williams",
      "email": "admin.williams@example.com",
      "password": "admin123",
      "userType": "admin",
      "permissions": ["home", "form", "viewDetails"]
    },
    {
      "id": 7,
      "username": "laura_evans",
      "email": "laura.evans@example.com",
      "password": "pass5678",
      "userType": "normal",
      "permissions": ["home"]
    },
    {
      "id": 8,
      "username": "customer_anderson",
      "email": "customer.anderson@example.com",
      "password": "cust7890",
      "userType": "customer",
      "permissions": ["home", "form"]
    },
    {
      "id": 9,
      "username": "admin_taylor",
      "email": "admin.taylor@example.com",
      "password": "adminpass",
      "userType": "admin",
      "permissions": ["home", "form", "viewDetails"]
    },
    {
      "id": 10,
      "username": "normal_jackson",
      "email": "normal.jackson@example.com",
      "password": "normalpass",
      "userType": "normal",
      "permissions": ["home"]
    }
  ];
  
 
  export default perms;



  