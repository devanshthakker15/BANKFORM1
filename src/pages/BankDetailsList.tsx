// BankDetailsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumb";
import { RootState, AppDispatch } from "../redux/store";
import { fetchBankDataAsync, setCurrentBank } from "../redux/formSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import "../styles/bankStyles.css";
import { BASE_URL } from "../utils/constants";
import { apiDelete, apiPut, apiGet } from "../utils/getApi";
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
    // Fetch data when currentPage or debouncedQuery changes
    dispatch(fetchBankDataAsync({ page: currentPage, query: debouncedQuery }));
  }, [dispatch, currentPage, debouncedQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchParams({ page: "1", q: value });
  };

  const handleEdit = async (id: number) => {
    try {
      const bankData = await apiGet(`/api/payment/banks/${id}/`);
      dispatch(setCurrentBank(bankData));
      navigate(`/banks/edit/${id}`);
    } catch (error) {
      console.error("Failed to fetch bank details for editing:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("access_token") || "";
    if (id) {
      try {
        await apiDelete(`${BASE_URL}/api/payment/banks/${id}/`, token);
        dispatch(fetchBankDataAsync({ page: currentPage, query: debouncedQuery }));
      } catch (error) {
        console.error("Failed to delete bank record:", error);
      }
    } else {
      console.error("Invalid ID for deletion:", id);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: number) => {
    const token = localStorage.getItem("access_token") || "";
    const updatedStatus = currentStatus === 1 ? 0 : 1;
    try {
      await apiPut(
        `/api/payment/banks/${id}/`,
        { is_active: updatedStatus },
        token
      );
      dispatch(fetchBankDataAsync({ page: currentPage, query: debouncedQuery }));
    } catch (error) {
      console.error("Failed to toggle bank record status:", error);
    }
  };

  // Calculate totalPages based on totalCount and itemsPerPage
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
                    <td>{item.bank_country?.country || "N/A"}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={item.is_active === 1}
                          onChange={() =>
                            handleToggleActive(item.id, item.is_active)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    {hasEditBankPermission && (
                      <td>
                        <Button
                          variant="primary"
                          style={{ width: '70px', margin: "4px"}}
                          onClick={() => handleEdit(item.id)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>
                        <Button
                          variant="danger"
                          style={{ width: '70px', margin: "4px" }}
                          onClick={() => handleDelete(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default BankDetailsList;
