import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import "../styles/bankStyles.css";
import Breadcrumbs from "../components/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faTrashCan,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

interface BankData {
  id: number;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
}

const BankDetailsList: React.FC = () => {
  const [bankData, setBankData] = useState<BankData[]>([]);
  const [filteredData, setFilteredData] = useState<BankData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("q") || "";

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const hasEditBankPermission = currentUser?.permissions?.includes("editBank");

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("bankFormData") || "[]"
    ) as BankData[];
    setBankData(storedData);
    setFilteredData(
      storedData.filter(
        (item) =>
          item.bankName.toLowerCase().includes(query.toLowerCase()) ||
          item.accountHolderName.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams({ page: "1", q: value });
  };

  const handleEdit = (id: number) => {
    navigate(`/banks/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const updatedData = bankData.filter((item) => item.id !== id);
    setBankData(updatedData);
    setFilteredData(updatedData);
    localStorage.setItem("bankFormData", JSON.stringify(updatedData));

    const totalPages = Math.ceil(updatedData.length / itemsPerPage);
    if (currentPage > totalPages) {
      setSearchParams({ page: totalPages.toString(), q: query });
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), q: query });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Breadcrumbs />
      <div className="container mt-2">
        <h2>Bank Details Submissions</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Bank Name or Account Holder Name"
            className="form-control"
            value={query}
            onChange={handleSearch}
          />
        </div>

        {/* Make table responsive on mobile */}
        <div className="table-responsive-mobile">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Serial No.</th>
                <th className="bank-name">Bank Name</th>
                <th className="account-holder">Account Holder Name</th>
                <th className="account-number">Account Number</th>
                {hasEditBankPermission && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((item, index) => (
                  <tr key={item.id}>
                    <td>{startIndex + index + 1}</td>
                    <td className="bank-name">{item.bankName}</td>
                    <td className="account-holder">{item.accountHolderName}</td>
                    <td className="account-number">{item.accountNumber}</td>
                    {hasEditBankPermission && (
                      <td>
                        <button
                          className="button btn btn-sm m-1 btn-primary"
                          onClick={() => handleEdit(item.id)}
                        >
                          <FontAwesomeIcon icon={faPen} className="nav-icon ms-1" />
                        </button>
                        <button
                          className="button btn btn-sm m-1 btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} className="nav-icon ms-1" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={hasEditBankPermission ? 5 : 4} className="text-center">
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
          className="btn btn-primary mb-5 me-2"
          onClick={() => handleNavigation("/banks/add")}
        >
          Go to Form
        </button>
      </div>
    </>
  );
};

export default BankDetailsList;
