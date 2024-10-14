import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const navigate = useNavigate();
  const itemsPerPage = 3;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("bankFormData") || "[]") as BankData[];
    setBankData(storedData);
    setFilteredData(storedData);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = bankData.filter((item) =>
      item.bankName.toLowerCase().includes(value.toLowerCase()) ||
      item.accountHolderName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (id: number) => {
    navigate(`/bank-form/${id}`);
  };

  const handleDelete = (id: number) => {
    const updatedData = bankData.filter((item) => item.id !== id);
    setBankData(updatedData);
    setFilteredData(updatedData); // Update filtered data as well
    localStorage.setItem("bankFormData", JSON.stringify(updatedData));

    // Check if current page entries are empty
    const totalPages = Math.ceil(updatedData.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages); // Set current page to the last available page
    }
    // Check if the current page is now empty
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEntries = updatedData.slice(startIndex, startIndex + itemsPerPage);
    if (currentEntries.length === 0 && totalPages > 0) {
      setCurrentPage(1); // Reset to the first page
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
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEntries = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2>Bank Details Submissions</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Bank Name or Account Holder Name"
          className="form-control"
          value={searchTerm}
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
                <td>{startIndex + index + 1}</td> {/* Serial number calculation */}
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

      {/* Back to Form Button */}
      <div className="text-center mt-4 d-flex justify-content-around">
        <button className="btn btn-primary" onClick={handleBackToForm}>
          Back to Form
        </button>
        <button className="btn btn-primary" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BankDetailsList;
