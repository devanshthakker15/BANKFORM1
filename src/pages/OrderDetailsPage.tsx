import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrdersById, fetchLastBillById } from "../redux/orderSlice";
import Badge from "../components/Badge";
import { formatDate } from "../utils/commonFunction";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { orders, status, error } = useAppSelector((state) => state.orders);
  const order = orders[0];

  const ScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [activeTab, setActiveTab] = useState<
    "productDetails" | "paymentHistory" | "creditNote"
  >("productDetails");

  const getOrderStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "cancelled":
        return "red";
      case "pickup":
        return "cyan";
      default:
        return "blue";
    }
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

  useEffect(() => {
    if (id) {
      dispatch(fetchOrdersById({ id: Number(id) }));
      ScrollToTop();
    }
  }, [id, dispatch]);

  if (status === "loading") {
    return <Loader />;
  }

  if (!order) {
    return <div>No order details available.</div>;
  }

  const isPaymentsArray = Array.isArray(order.payments);

  return (
    <div className="body">
      <h2>#{order.invoice_code || "N/A"}</h2>
      <div className="row">
        <div className="col-md-6">
          <Card title="Order Details">
            <p>
              <strong>Invoice Number:</strong> {order.invoice_code || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge
                badgeText={order.status?.toLocaleUpperCase() || "N/A"}
                badgeBackgroundColor={getOrderStatusColor(order.status)}
                badgeColor="black"
              />
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {order.created_at ? formatDate(order.created_at) : "N/A"}
            </p>
            <p>
              <strong>Biller Name:</strong>{" "}
              {order.employee?.account_holder || "N/A"}
            </p>
          </Card>
        </div>
        <div className="col-md-6">
          <Card title="Customer Details">
            <p>
              <strong>Name:</strong> {order.customer?.name || "N/A"}
            </p>
            <p>
              <strong>Mobile Number:</strong>{" "}
              {order.customer?.contact_number || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {order.customer?.email || "N/A"}
            </p>
            <p>
              <strong>Company Name:</strong>{" "}
              {order.customer?.company_name || "N/A"}
            </p>
          </Card>
        </div>
      </div>
      <div className="col-md-12">
        <Card title="Payment Details">
          <div className="row mt-1">
            <div className="col-md-5">
              <p>
                <strong>Payment Type:</strong>{" "}
                {order.payment_type?.payment_type || "N/A"}
                {/* {order.payments?.payment_mode?.payment_mode} */}
              </p>
            </div>
            <div className="col-md-5">
              <p>
                <strong>Delivery Type:</strong>{" "}
                {order.delivery_type ? (
                  <Badge
                    badgeText={order.delivery_type.toLocaleUpperCase()}
                    badgeBackgroundColor={getOrderStatusColor(
                      order.delivery_type
                    )}
                    badgeColor="black"
                  />
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-md-12">
        <Card title="Order Actions">
          <Button
            icon={faPrint}
            variant="primary"
            style={{ width: "100px", margin: "4px" }}
            onClick={() => handlePrint(order.id)}
          >
            Bill
          </Button>
          {order.status === "completed" && (
            <Button
              icon={faUndo}
              variant="danger"
              style={{ width: "100px", margin: "4px" }}
            >
              Return
            </Button>
          )}
        </Card>
      </div>
      <div className="col-md-12">
        <Card title="Additional Details">
          <div className="tabs">
            <span
              className={`tab me-5 ${
                activeTab === "productDetails" ? "active" : ""
              }`}
              onClick={() => setActiveTab("productDetails")}
            >
              Product Details
            </span>
            {order.status === "completed" && (
              <>
                <span
                  className={`tab ${
                    activeTab === "paymentHistory" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("paymentHistory")}
                >
                  Payment History
                </span>
                <span
                  className={`tab ms-5 ${
                    activeTab === "creditNote" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("creditNote")}
                >
                  Credit Note
                </span>
              </>
            )}
          </div>
          {activeTab === "productDetails" && (
            <div>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <table className="table table-hover mt-3">
                  <thead style={{ backgroundColor: "#f8f9fa", color: "black" }}>
                    <tr>
                      <th>#</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>MRP</th>
                      <th>Discount</th>
                      <th>Tax</th>
                      <th>Unit Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.length > 0 ? (
                      order.products.map((product, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{product.product?.product_code || "N/A"}</td>
                          <td>{product.product?.print_name || "N/A"}</td>
                          <td>{product.quantity || "N/A"}</td>
                          <td>₹ {product.total_amount?.toFixed(2) || "N/A"}</td>
                          <td>{product.discount_value || "-"}</td>
                          <td>₹ {product.total_tax?.toFixed(2) || "N/A"}</td>
                          <td>₹ {product.unit_price?.toFixed(2) || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center" }}>
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {order.products?.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>{order.products.length}</strong>
                    </span>
                    <span>Total Items</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>
                        ₹
                        {order.products
                          .reduce(
                            (acc, product) => acc + product.total_amount,
                            0
                          )
                          .toFixed(2)}
                      </strong>
                    </span>
                    <span>MRP</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>
                        ₹
                        {order.products
                          .reduce(
                            (acc, product) =>
                              acc + (product.discount_value || 0),
                            0
                          )
                          .toFixed(2)}
                      </strong>
                    </span>
                    <span>Total Discount</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>
                        ₹
                        {order.products
                          .reduce((acc, product) => acc + product.total_tax, 0)
                          .toFixed(2)}
                      </strong>
                    </span>
                    <span>Tax Amount</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>
                        ₹
                        {order.products
                          .reduce((acc, product) => acc + product.unit_price, 0)
                          .toFixed(2)}
                      </strong>
                    </span>
                    <span>Net Amount</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "paymentHistory" && (
            <div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Payment Mode</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {isPaymentsArray && order.payments?.length > 0 ? (
                    order.payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{payment.payment_mode?.payment_mode || "N/A"}</td>
                        <td>
                          {payment.created_at
                            ? formatDate(payment.created_at)
                            : "N/A"}
                        </td>
                        <td>₹{payment.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No payment history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "creditNote" && <div>Credit Note Content</div>}
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
