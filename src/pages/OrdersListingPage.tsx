import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { fetchOrders, fetchOrdersWithFilters, fetchLastBillById } from "../redux/orderSlice";
import { RootState } from "../redux/store";
import SelectInput from "../components/SelectInput";
import "../App.css";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { formatDate } from "../utils/commonFunction";
import { faPrint, faEye } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { Formik } from "formik";

const OrderDetailsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { orders, status, totalCount } = useSelector(
    (state: RootState) => state.orders
  );

  const itemsPerPage = 10;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const initialFilters = {
    start_date: "",
    end_date: "",
    status: "all",
    paymentType: "all",
    deliveryType: "all",
    query: "",
  };
  
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 1) {
      dispatch(
        fetchOrdersWithFilters({
          page: currentPage,
          query: params.query || "",
          order_status: params.status || undefined,
          delivery_type: params.deliveryType || undefined,
          start_date: params.start_date || undefined,
          end_date: params.end_date || undefined,
        })
      );
    } else {
      dispatch(fetchOrders({ page: currentPage }));
    }
  }, [dispatch, searchParams, currentPage]);

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled"}
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

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "blue";
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

  const handleFilterChange = (values: typeof initialFilters) => {
    const filteredParams = Object.entries(values)
      .filter(([key, value]) => value && value !== "all")
      .map(([key, value]) => ({ [key]: value }));
      console.log(filteredParams);
    setSearchParams({ page: "1", ...Object.assign({}, ...filteredParams) });
  };

  const handlePrint = async (billId: number) => {
    const result = await dispatch(fetchLastBillById({ billId }));
    if (fetchLastBillById.fulfilled.match(result)) {
      console.log("Fetched Bill Data:", result.payload);
  
     
      const base64String = result.payload;  
      download(base64String, 'Invoice.pdf');
    } else {
      console.error("Error fetching bill:", result.payload);
    }
  };
  
  // The provided download function
  const download = (base64EncodedData, fileName) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = `data:application/pdf;base64,${base64EncodedData}`;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return (
    <div>
      <h2>Order Details</h2>
      <div className="container mt-2">
        <Formik
          initialValues={initialFilters}
          onSubmit={() => {}}
          enableReinitialize
        >
          {({ values, setFieldValue }) => {
                        useEffect(() => {
                          handleFilterChange(values);
                        }, [values]);
            return (
              <form>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      className="form-control"
                      max={
                        values.end_date ||
                        new Date().toISOString().split("T")[0]
                      }
                      value={values.start_date}
                      onChange={(e) =>
                        setFieldValue("start_date", e.target.value)
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
                      max={new Date().toISOString().split("T")[0]}
                      value={values.end_date}
                      onChange={(e) =>
                        setFieldValue("end_date", e.target.value)
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
                        setFieldValue("status", selected?.value || "all")
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
                      onChange={(selected) =>
                        setFieldValue("paymentType", selected?.value || "all")
                      }
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
                        setFieldValue("deliveryType", selected?.value || "all")
                      }
                    />
                  </div>
                   )}
                  <div className="col-md-9 mt-3">
                    <label htmlFor="query">Search Customer</label>
                    <input
                      type="text"
                      name="query"
                      placeholder="Search by Customer Name / Invoice Code/ Payable Amount"
                      className="form-control"
                      value={values.query}
                      onChange={(e) => setFieldValue("query", e.target.value)}
                    />
                     {/* <input
                   type="text"
                   placeholder="Search by Customer Name/Invoice"
                   className="form-control"
                   name="query"
                   value={values.query}
                   onChange={handleChange}
                 /> */}

                  </div>
                </div>
              </form>
            );
          }}
        </Formik>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>#</th>
              <th style={{ textAlign: "center" }}>Invoice</th>
              {/* <th style={{ textAlign: "center" }}>Invoice number</th> */}
              <th style={{ textAlign: "center" }}>Customer</th>
              <th style={{ textAlign: "center" }}>Payable Amount</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Created At</th>
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
              )  : (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td style={{ textAlign: "center" }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td style={{ textAlign: "center" }}>{order.invoice_code}</td>
                  {/* <td style={{ textAlign: "center" }}>{order.payable_amount}</td> */}
                  <td style={{ textAlign: "center" }}>{order.customer?.name || order.customer_name}</td>
                  <td style={{ textAlign: "center" }}>{order.payable_amount}</td>
                  <td style={{
                     textAlign: "center",
                     display:"inline-block",
                     color: "white",
                     marginLeft:"55px",
                     marginTop:"10px",
                     borderRadius:"10px",
                     backgroundColor: getOrderStatusColor(order.status),
                   }}>
                    {order.status}
                  </td>
                  <td style={{ textAlign: "center" }}>{formatDate(order.created_at)}</td>
                  <td>
                    <Button
                      icon={faEye}
                      variant="success"
                      style={{ width: "70px", margin: "4px" }}
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
            )}
          </tbody>
        </table>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default OrderDetailsList;
