import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/Pagination";
import Breadcrumbs from "../components/Breadcrumb";
import { RootState, AppDispatch } from "../redux/store"; // Import AppDispatch
import { fetchBankDataAsync } from "../redux/formSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import "../styles/bankStyles.css"

const BankDetailsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch: AppDispatch = useDispatch(); // Use typed dispatch
  const navigate = useNavigate();

  // Fetch state from Redux
  const { formData, status } = useSelector((state: RootState) => state.form);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const hasEditBankPermission = currentUser?.permissions?.includes("editBank");

  const itemsPerPage = 5;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    console.log("Component mounted, current status:", status);
    if (status === "idle") {
      dispatch(fetchBankDataAsync());
    }
  }, [dispatch, status]);

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const filteredData = formData.filter((item) =>
    item.bank_name.toLowerCase().includes(query.toLowerCase()) ||
    item.account_holder_name.toLowerCase().includes(query.toLowerCase()) ||
    item.account_number.toLowerCase().includes(query.toLowerCase()) ||
    (item.bank_country?.country.toLowerCase().includes(query.toLowerCase()) || "")
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams({ page: "1", q: value });
  };

  const handleEdit = (id: number) => {
    navigate(`/banks/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    // For now, just remove the data locally
    const updatedData = formData.filter((item) => item.id !== id);
    // Ideally, here should be an API call to delete the bank data from the backend
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), q: query });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
            value={query}
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
                {hasEditBankPermission && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{item.bank_name}</td>
                    <td>{item.account_holder_name}</td>
                    <td>{item.account_number}</td>
                    <td>{item.bank_country?.country || "N/A"}</td>
                    {hasEditBankPermission && (
                      <td>
                        <button
                          className="btn btn-sm m-1 btn-primary"
                          onClick={() => handleEdit(item.id)}
                          style={{ width: '80px' }}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          className="btn btn-sm m-1 btn-danger"
                          onClick={() => handleDelete(item.id)}
                          style={{ width: '80px' }}
                          
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hasEditBankPermission ? 6 : 5} className="text-center">
                    No data found
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

        <button
          className="btn btn-primary mb-5"
          onClick={() => navigate("/banks/add")}
        >
          Go to Form
        </button>
      </div>
    </>
  );
};

export default BankDetailsList;
