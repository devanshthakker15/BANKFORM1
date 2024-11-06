import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import { Link} from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumb";
const ManageEmployees: React.FC = () => {

  const [employees, setEmployees] = useState([]);

  // Function to fetch employee data
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      console.log("User data:", response.data); 
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
    <Breadcrumbs />
    <div className="container">
      <div className="text-right mb-4 d-flex justify-content-between">
      <h1>Employee Account</h1>
          <Link to="/account/add" className="btn btn-secondary m-2">
            Add Employee
          </Link>
        </div>

      {employees.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email Address</th>
              <th>Company Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.company.name}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary mr-2"
                    // onClick={() => handleEdit(employee.id)}
                    style={{ width: "70px", margin: "4px" }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    // onClick={() => handleDelete(employee.id)}
                    style={{ width: "70px", margin: "4px" }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading employees...</p>
      )}
    </div>
    </div>
  );
};

export default ManageEmployees;
