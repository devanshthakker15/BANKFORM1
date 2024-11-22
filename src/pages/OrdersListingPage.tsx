import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrdersWithFilters, fetchLastBillById } from "../redux/orderSlice";
import { RootState } from "../redux/store";
import SelectInput from "../components/SelectInput";
import "../App.css";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { formatDate } from "../utils/commonFunction";
import { faPrint, faEye, faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { Formik } from "formik";
import { Modal } from "react-bootstrap";
import Badge from "../components/Badge";
import { fetchActiveStores } from "../redux/storeSlice";

const OrderDetailsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedStore, setSelectedStore] = useState<number | null>(null); 
  const formikValuesRef = useRef(null);
  const dispatch = useAppDispatch();
  const { orders, status, totalCount } = useSelector((state: RootState) => state.orders);
  const { stores } = useAppSelector((state) => state.store);
  const [showModal, setShowModal] = useState(false);

  const storeOptions = stores.map((store) => ({
    value: store.id,
    label: store.store_name,
  }));

  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const currentDate = new Date().toISOString().split("T")[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate());
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

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentTypeOptions = [
    { value: "all", label: "All" },
    { value: "pay now", label: "Pay Now" },
    { value: "pay later", label: "Pay Later" },
  ];

  const deliveryTypeOptions = [
    { value: "all", label: "All" },
    { value: "delivery", label: "Delivery" },
    { value: "pickup", label: "Pickup" },
  ];

  const handleOpenModal = () => {
    setShowModal(true);
    dispatch(fetchActiveStores());
  };

  const getOrderStatusColor = (status: string) => {
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

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev.entries()),
      page: page.toString(),
    }));
    
  };

  

  const handlePrint = async (billId: number) => {
    const result = await dispatch(fetchLastBillById({ billId }));
    if (fetchLastBillById.fulfilled.match(result)) {
      const base64String = result.payload;
      printPDF(base64String);
    }
  };

  const printPDF = (base64EncodedData: string) => {
    const pdfWindow = window.open("", "_blank");
    if (pdfWindow) {
      pdfWindow.document.write(
        `<iframe width="100%" height="100%" src="data:application/pdf;base64,${base64EncodedData}" frameborder="0" allowfullscreen></iframe>`
      );
      pdfWindow.print();
    }
  };


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedStore(selectedValue); 
    console.log("Store Selected", selectedStore);
  };

  const handleFiltersChange = (values: any) => {
    const filters = {
      page: currentPage,
      query: values.query || debouncedQuery,
      order_status: values.status !== "all" ? values.status : undefined,
      delivery_type: values.deliveryType !== "all" ? values.deliveryType : undefined,
      start_date: values.start_date,
      end_date: values.end_date,
      store: selectedStore || undefined,
    };

    dispatch(fetchOrdersWithFilters(filters));
  };

  useEffect(() => {
    handleFiltersChange(initialFilters);
  }, [debouncedQuery, currentPage, selectedStore]);

  return (
    <div>
      <h2>Order Details</h2>
      <div className="container mt-2">
        <Formik
          initialValues={initialFilters}
          onSubmit={handleFiltersChange} 
          enableReinitialize
        >
          {({ values, setFieldValue }) => {
            formikValuesRef.current = values;

            const updateFilters = (field: string, value: any) => {
              setFieldValue(field, value);
              handleFiltersChange({ ...values, [field]: value });
            };

            return (
              <div>
                <form>
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label htmlFor="start_date">Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        className="form-control"
                        max={values.end_date}
                        value={values.start_date}
                        onChange={(selectedDate) => updateFilters("start_date", selectedDate.target.value)}
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
                        onChange={(selectedDate) => updateFilters("end_date", selectedDate.target.value)}
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
                        onChange={(selected) => updateFilters("status", selected?.value || "all")}
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
                        onChange={(selected) => updateFilters("paymentType", selected?.value || "all")}
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
                          onChange={(selected) => updateFilters("deliveryType", selected?.value || "all")}
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
                        onChange={(e) => updateFilters("query", e.target.value)}
                      />
                    </div>
                  </div>
                </form>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "-80px",
                    marginLeft: "-80px",
                  }}
                >
                  <Button
                    icon={faBars}
                    variant="primary"
                    style={{ width: "50px", margin: "4px" }}
                    onClick={handleOpenModal}
                  />
                </div>
              </div>
            );
          }}
        </Formik>
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
                  <td>₹ {order.payable_amount}</td>
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
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Select Store</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <select
              className="form-select"
              aria-label="Store select"
              onChange={handleSelectChange}
            >
              <option value="">Select a store</option>
              {storeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default OrderDetailsList;
