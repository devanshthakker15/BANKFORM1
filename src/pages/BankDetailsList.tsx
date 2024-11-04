// src/pages/BankDetailsList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumb";
import { RootState, AppDispatch } from "../redux/store";
import {
  fetchBankDataAsync,
  fetchBankByIdAsync,
  deleteBankAsync,
  toggleBankActiveStatusAsync,
} from "../redux/formSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import "../styles/bankStyles.css";
import { Button } from "react-bootstrap";

const BankDetailsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { formData, totalCount } = useSelector(
    (state: RootState) => state.form
  );
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const hasEditBankPermission = currentUser?.permissions?.includes("editBank");

  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1000ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchBankDataAsync({ page: currentPage, query: debouncedQuery }));
  }, [dispatch, currentPage, debouncedQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchParams({ page: "1", q: value });
  };

  const handleEdit = (id: number) => {
    dispatch(fetchBankByIdAsync(id)).then(() => navigate(`/banks/edit/${id}`));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteBankAsync({ id, page: currentPage, query: debouncedQuery }));
  };

  const handleToggleActive = (id: number, currentStatus: number) => {
    dispatch(
      toggleBankActiveStatusAsync({
        id,
        currentStatus,
        page: currentPage,
        query: debouncedQuery,
      })
    );
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), q: debouncedQuery });
  };

  return (
    <>
      <Breadcrumbs />
      <div className="container mt-2">
        <h2>Bank Details Submissions</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Bank Name, Account Holder, Number, or Country"
            className="form-control"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="table-responsive-mobile">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Bank Name</th>
                <th>Account Holder Name</th>
                <th>Account Number</th>
                <th>Country</th>
                <th>Is Active</th>
                {hasEditBankPermission && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {formData.length > 0 ? (
                formData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.bank_name}</td>
                    <td>{item.account_holder_name}</td>
                    <td>{item.account_number}</td>
                    <td>
                      {item.bank_country ? item.bank_country.country : "N/A"}
                    </td>
                    <td>
                      <Button
                        variant={item.is_active === 1 ? "success" : "danger"}
                        onClick={() =>
                          handleToggleActive(item.id, item.is_active)
                        }
                        style={{ width: "90px", margin: "4px" }}
                      >
                        {item.is_active === 1 ? "Active" : "Inactive"}
                      </Button>
                    </td>
                    {hasEditBankPermission && (
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary mr-2"
                          onClick={() => handleEdit(item.id)}
                          style={{ width: "70px", margin: "4px" }}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id)}
                          style={{ width: "70px", margin: "4px" }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default BankDetailsList;
