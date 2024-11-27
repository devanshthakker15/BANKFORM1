import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import SelectInput from "../components/SelectInput";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { Formik } from "formik";
import { Modal } from "react-bootstrap";
import { fetchOrdersWithFilters, fetchLastBillById } from "../redux/orderSlice";
import { fetchActiveStores, setSelectedStore } from "../redux/storeSlice";
import { formatDate } from "../utils/commonFunction";
import {
  faPrint,
  faEye,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import {
  deliveryTypeOptions,
  statusOptions,
  paymentTypeOptions,
  printPDF,
  getOrderStatusColor,
} from "../utils/constants";

const OrderListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();
  const { orders, status, totalCount } = useSelector(
    (state: RootState) => state.orders
  );
  const { stores, selectedStore } = useAppSelector((state) => state.store);

  const storeOptions = stores.map((store) => ({
    value: store.id,
    label: store.store_name,
  }));

  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const currentDate = new Date().toISOString().split("T")[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 25);
  const defaultStartDate = startDate.toISOString().split("T")[0];
  const defaultEndDate = currentDate;

  const initialFilters = {
    start_date: defaultStartDate,
    end_date: defaultEndDate,
    status: "all",
    paymentType: "all",
    deliveryType: "all",
    query: debouncedQuery || "",
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev.entries()),
      page: page.toString(),
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    dispatch(setSelectedStore(selectedValue));
    setShowModal(false);
    setSearchParams({ page: "1" });
  };

  const handleFiltersChange = (values: any) => {
    if (!selectedStore) return;
    const filters = {
      page: currentPage,
      query: values.query || debouncedQuery,
      order_status: values.status !== "all" ? values.status : undefined,
      delivery_type:
        values.deliveryType !== "all" ? values.deliveryType : undefined,
      start_date: values.start_date,
      end_date: values.end_date,
      store: selectedStore,
    };
    dispatch(fetchOrdersWithFilters(filters));
  };

  const updateFilters = (field: string, value: any, values: any, setFieldValue: any) => {
    setFieldValue(field, value);
    handleFiltersChange({ ...values, [field]: value });
  };

  const handlePrint = async (billId: number): Promise<void> => {
    const result = await dispatch(fetchLastBillById({ billId }));
    if (fetchLastBillById.fulfilled.match(result)) {
      const base64String = result.payload;
      printPDF(base64String);
    }
  };

  useEffect(() => {
    dispatch(fetchActiveStores());
    if (!selectedStore) {
      setShowModal(true); // Show modal if no store is selected
    } else {
      handleFiltersChange(initialFilters);
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      handleFiltersChange(initialFilters);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery, currentPage, selectedStore, dispatch]);

  return (
    <div>
      <h2>Order Details</h2>
      <div className="container mt-2">
        <Formik
          initialValues={initialFilters}
          onSubmit={handleFiltersChange}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <div>
              <form>
                {/* Filters Section */}
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      className="form-control"
                      max={values.end_date}
                      value={values.start_date}
                      onChange={(selectedDate) =>
                        updateFilters("start_date", selectedDate.target.value, values, setFieldValue)
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      className="form-control"
                      min={values.start_date}
                      max={currentDate}
                      value={values.end_date}
                      onChange={(selectedDate) =>
                        updateFilters("end_date", selectedDate.target.value, values, setFieldValue)
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <SelectInput
                      label="Order Status"
                      name="status"
                      options={statusOptions}
                      value={statusOptions.find(
                        (option) => option.value === values.status
                      )}
                      onChange={(selected) =>
                        updateFilters("status", selected?.value || "all", values, setFieldValue)
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <SelectInput
                      label="Payment Type"
                      name="paymentType"
                      options={paymentTypeOptions}
                      value={paymentTypeOptions.find(
                        (option) => option.value === values.paymentType
                      )}
                      onChange={(selected) => {
                        updateFilters("paymentType", selected?.value || "all", values, setFieldValue);
                        if (selected?.value === "all") {
                          updateFilters("deliveryType", "all", values, setFieldValue);
                        }
                      }}
                    />
                  </div>
                  {values.paymentType === "pay later" && (
                    <div className="col-md-2">
                      <SelectInput
                        label="Delivery Type"
                        name="deliveryType"
                        options={deliveryTypeOptions}
                        value={deliveryTypeOptions.find(
                          (option) => option.value === values.deliveryType
                        )}
                        onChange={(selected) =>
                          updateFilters("deliveryType", selected?.value || "all", values, setFieldValue)
                        }
                      />
                    </div>
                  )}
                  <div className="col-md-10 mt-3 mb-2">
                    <input
                      type="text"
                      name="query"
                      placeholder="Search by Customer Name / Invoice Code / Payable Amount"
                      className="form-control"
                      value={values.query}
                      onChange={(e) => updateFilters("query", e.target.value, values, setFieldValue)}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </Formik>

        {/* Change Store Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginTop: "-80px",
            marginLeft: "-90px",
          }}
        >
          <Button
            icon={faStore}
            text=" Change Store"
            variant="secondary"
            onClick={() => setShowModal(true)}
            style={{ marginBottom: "18px", width: "150px" }}
          />
        </div>

        {/* Order Table */}
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Payable Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
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
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{order.invoice_code}</td>
                  <td>{order.customer?.name || order.customer_name}</td>
                  <td>₹ {order.payable_amount.toFixed(2)}</td>
                  <td>
                    <Badge
                      badgeText={order.status.toLocaleUpperCase()}
                      badgeBackgroundColor={getOrderStatusColor(order.status)}
                      badgeColor="black"
                    />
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <Button
                      icon={faEye}
                      variant="success"
                      style={{ width: "70px", margin: "4px" }}
                      link={`/orders/${order.id}`}
                    />
                    <Button
                      icon={faPrint}
                      variant="primary"
                      style={{ width: "70px", margin: "4px" }}
                      onClick={() => handlePrint(order.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No orders available.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Store Selection Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Select Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <select
              className="form-select"
              aria-label="Store select"
              onChange={handleSelectChange}
              value={selectedStore || ""}
            >
              <option value="">Select a store</option>
              {storeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default OrderListPage;
