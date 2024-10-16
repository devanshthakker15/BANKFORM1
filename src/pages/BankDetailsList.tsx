import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import "../styles/bankStyles.css";

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
  const itemsPerPage = 2;

  // Get the current page and query from the URL or default to 1 and empty string
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("q") || "";

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams({ page: "1", q: value });
  };

  const handleEdit = (id: number) => {
    navigate(`/bank-form/${id}`);
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

  const handleBackToForm = () => {
    navigate("/bank-form");
  };

  const handleBackToHome = () => {
    navigate("/home");
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
    <div className="container mt-5">
      <h2>Bank Details Submissions</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Bank Name or Account Holder Name"
          className="form-control"
          value={query}
          onChange={handleSearch}
        />
      </div>

      {/* Submission List */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th className="bank-name">Bank Name</th>
            <th className="account-holder">Account Holder Name</th>
            <th className="account-number">Account Number</th>
            <th>Actions</th>
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
                <td>
                  <button
                    className="button btn btn-primary"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="button btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    <strong>X</strong>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Back to Form and Home Buttons */}
      <div className="text-center mt-4 d-flex justify-content-between">
        <button
          className="btn btn-primary custom-button"
          onClick={handleBackToForm}
        >
          Back to Form
        </button>
        <button
          className="btn btn-primary custom-button"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BankDetailsList;
