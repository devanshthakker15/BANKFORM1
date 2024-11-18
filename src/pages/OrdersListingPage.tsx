import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
import { useSearchParams } from "react-router-dom";
import { RootState } from "../redux/store";
import SelectInput from "../components/SelectInput";
import "../App.css";
import { useAppDispatch } from "../redux/hooks";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import {
  faTrashCan,
  faPen,
  faPrint,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { formatDate } from "../utils/commonFunction";

import { bankOptions } from "../utils/constants";

const OrderDetailsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const dispatch = useAppDispatch();
  const { orders, status, error, totalCount } = useSelector(
    (state: RootState) => state.orders
  );

  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchParams({ page: "1", query: value });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const bankOptions = [
    { value: "Bank of Baroda", label: "Bank of Baroda" },
    { value: "HDFC Bank", label: "HDFC Bank" },
    { value: "ICICI Bank", label: "ICICI Bank" },
    { value: "IDFC First Bank", label: "IDFC First Bank" },
    { value: "Kotak Bank", label: "Kotak Bank" },
    { value: "SBI", label: "SBI" },
    { value: "IDBI Bank", label: "IDBI Bank" },
    { value: "DCB Bank", label: "DCB Bank" },
    { value: "TJSB Bank", label: "TJSB Bank" },
    { value: "Axis Bank", label: "Axis Bank" },
    { value: "Bank Of India", label: "Bank Of India" },
    { value: "Bank of Maharashtra", label: "Bank of Maharashtra" },
    { value: "Union Bank", label: "Union Bank" },
    { value: "Canera Bank", label: "Canera Bank" },
    { value: "Central Bank of India", label: "Central Bank of India" },
  ];

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "blue"; 
    }
  };

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
    dispatch(fetchOrders({ page: currentPage, query: debouncedQuery }));
  }, [dispatch, currentPage, debouncedQuery]);


  return (
    <div>
      <h2>Order Details</h2>

      <div className="container mt-2">
        <div className="row col-md-4">
          {/* <SelectInput 
                label="Start Date"
                name="start_date"
                options={bankOptions}
            /> */}
          <select
            className="form-select form-select me-2 "
            aria-label=".form-select"
          >
            <option selected>Open this select menu</option>
  
          </select>

          <select
            className="form-select form-select me-2"
            aria-label=".form-select"
          >
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>

          <select
            className="form-select form-select me-2"
            aria-label=".form-select"
          >
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>

          <select
            className="form-select form-select me-2"
            aria-label=".form-select"
          >
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div className="col-md-9 d-flex justify-content-center">
          <input
            type="text"
            placeholder="Search by Customer Name/ Invoice"
            className="form-control"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table className="table table-bordered table-hover text-nowrap">
          <thead>
            <tr>
              <th style={{ width: "80px", textAlign: "center" }}>Sr. no.</th>
              <th style={{ textAlign: "center" }}>Invoice Code</th>
              <th style={{ textAlign: "center" }}>Customer Name</th>
              <th style={{ textAlign: "center" }}>Total Amount</th>
              <th style={{ textAlign: "center" }}>Order Status</th>
              <th style={{ textAlign: "center" }}>Order Date</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan={7}>
                  <Loader />
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td style={{ textAlign: "center" }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td style={{ textAlign: "center" }}>{order.invoice_code}</td>
                  <td style={{ textAlign: "center" }}>{order.customer.name}</td>
                  <td style={{ textAlign: "center" }}>₹ {order.payable_amount}</td>
                  <td style={{ textAlign: "center",display: "inline-block", borderRadius:"5px",marginTop:"10px",marginLeft:"55px", backgroundColor: getOrderStatusColor(order.status)}}>{order.status}</td>
                  <td style={{ textAlign: "center" }}>{formatDate(order.created_at)}</td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      icon={faEye}
                      variant="success"
                      //   onClick={() => handleEdit(item.id)}
                      style={{ width: "70px", margin: "4px" }}
                    />
                    <Button
                      icon={faPrint}
                      variant="primary"
                      //   onClick={() => handleDelete(item.id)}
                      style={{ width: "70px", margin: "4px" }}
                      //   disabled={item.is_active !== 1}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ textAlign:"center"}} colSpan={7}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetailsList;
