import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumb";
import Loader from "../components/Loader";
import { fetchEmployeeByIdAsync } from "../redux/employeeSlice";
import { RootState, AppDispatch } from "../redux/store";
import { useAppDispatch } from "../redux/hooks";
import Button from "../components/Button";

const ManageEmployees: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const selectedEmployee = useSelector(
    (state: RootState) => state.employee.selectedEmployee
  );

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (id: number) => {
    dispatch(fetchEmployeeByIdAsync(id));
    navigate(`/account/edit/${id}`);
  };

  return (
    <div>
      {/* <Breadcrumbs /> */}
      <div className="container">
        <div className="text-right mb-4 d-flex justify-content-between">
          <h1>Employee Account</h1>
          <Button
            text="Add Employee"
            variant="secondary"
            link="/account/add"
            // className="m-2"
          />
        </div>

        {employees.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sr. no</th>
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
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.username}</td>
                  <td>{employee.email}</td>
                  <td>{employee.company.name}</td>
                  <td>
                    <Button
                      icon={faPen}
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(employee.id)}
                      style={{ width: "70px", margin: "4px" }}
                    />
                    <Button
                      icon={faTrashCan}
                      variant="danger"
                      size="sm"
                      // onClick={() => handleDelete(employee.id)}
                      style={{ width: "70px", margin: "4px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default ManageEmployees;
