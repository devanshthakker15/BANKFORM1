import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchange, faPrint, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrdersById, fetchLastBillById } from "../redux/orderSlice";
import Badge from "../components/Badge";
import { formatDate } from "../utils/commonFunction";
import { printPDF } from "../utils/constants";
import { Modal } from "react-bootstrap";
import TextInput from "../components/TextInput";
import { manageReturns } from "../redux/returnSlice";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { orders, status, error } = useAppSelector((state) => state.orders);
  const order = orders[0];
  const [showModal, setShowModal] = useState(false);

  const ScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [activeTab, setActiveTab] = useState<
    "productDetails" | "paymentHistory" | "creditNote" | "returnLayout"
  >("productDetails");

  const [returnQuantities, setReturnQuantities] = useState<{
    [key: number]: number;
  }>({});

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

  // Handler function for printing
  const handlePrint = async (billId: number): Promise<void> => {
    const result = await dispatch(fetchLastBillById({ billId }));
    if (fetchLastBillById.fulfilled.match(result)) {
      const base64String = result.payload;
      printPDF(base64String);
    }
  };

  const toggleReturnLayout = () => {
    setActiveTab((prevTab) =>
      prevTab === "productDetails" ? "returnLayout" : "productDetails"
    );
  };

  // Calculate summary for returned items
  const calculateReturnSummary = () => {
    if (!order || !order.products)
      return {
        totalReturnedItems: 0,
        totalRefundAmount: 0,
        totalPayableRefund: 0,
      };

    let totalReturnedItems = 0;
    let totalRefundAmount = 0;
    let totalPayableRefund = 0;
    order.products.forEach((product, index) => {
      const returnQuantity = returnQuantities[index] || 0;
      totalReturnedItems += returnQuantity;
      totalRefundAmount += returnQuantity * product.unit_price;
      totalPayableRefund += returnQuantity * product.unit_price;
    });
    return {
      totalReturnedItems,
      totalRefundAmount,
      totalPayableRefund,
    };
  };

  const handleReturnQuantityChange = (index: number, quantity: number) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [index]: quantity,
    }));
  };
  const { totalReturnedItems, totalRefundAmount, totalPayableRefund } =
    calculateReturnSummary();

  // Handle the return action when the button is clicked
  const handleReturnAction = async () => {
    if (!order) return;

    const returns = Object.entries(returnQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([index, quantity]) => {
        const product = order.products[parseInt(index)];
        return {
          id: product.product.id,
          quantity,
          unit_price: product.unit_price,
        };
      });

    const returnData = { orderId: order.id, returns };

    const result = await dispatch(manageReturns(returnData));
    console.log(returnData);

    if (manageReturns.fulfilled.match(result)) {
      alert("Return processed successfully!");
      setReturnQuantities({});
    } else {
      alert(`Error: ${result.payload}`);
    }
  };

  const calculateProductSummary = () => {
    let totalItems = 0;
    let totalMRP = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    if (order.products && Array.isArray(order.products)) {
      order.products.forEach((product) => {
        totalItems += product.quantity || 0;
        totalMRP += product.total_amount || 0;
        totalDiscount += product.discount_value || 0;
        totalTax += product.total_tax || 0;
      });
    }

    const roundOff = Math.round(totalMRP) - totalMRP;
    const netAmount = totalMRP + roundOff;

    return {
      totalItems,
      totalMRP,
      totalDiscount,
      totalTax,
      roundOff,
      netAmount,
    };
  };

  const { totalMRP, totalDiscount, totalTax, roundOff, netAmount } =
    calculateProductSummary();

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
            <div className="row">
              <div className="col-md-3">
                <strong>Invoice Number:</strong>
              </div>
              <div className="col-md-7">{order.invoice_code || "N/A"}</div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <strong>Status:</strong>{" "}
              </div>
              <div className="col-md-7">
                <Badge
                  badgeText={order.status?.toLocaleUpperCase() || "N/A"}
                  badgeBackgroundColor={getOrderStatusColor(order.status)}
                  badgeColor={order.status === "pending" ? "black" : "white"}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <strong>Created At:</strong>{" "}
              </div>
              <div className="col-md-7">
                {order.created_at ? formatDate(order.created_at) : "N/A"}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <strong>Biller Name:</strong>{" "}
              </div>
              <div className="col-md-7">
                {order.employee?.account_holder || "N/A"}
              </div>
            </div>
          </Card>
        </div>
        <div className="col-md-6">
          <Card title="Customer Details">
            <div className="row">
              <div className="col-md-3">
                <strong>Name:</strong>
              </div>
              <div className="col-md-7">{order.customer?.name || "N/A"}</div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <strong>Mobile Number:</strong>{" "}
              </div>
              <div className="col-md-7">
                {order.customer?.contact_number || "N/A"}
              </div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <strong>Email:</strong>
              </div>
              <div className="col-md-7"> {order.customer?.email || "N/A"}</div>
            </div>

            <div className="row">
              <div className="col-md-3">
                <strong>Company Name:</strong>{" "}
              </div>
              <div className="col-md-7">
                {order.customer?.company_name || "N/A"}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="col-md-12">
        <Card title="Payment Details">
          <div className="row mt-1">
            <div className="col-md-3">
              <strong>Payment Type:</strong>{" "}
            </div>
            <div className="col-md-3">
              {order.payment_type?.payment_type || "N/A"}
            </div>
            <div className="col-md-3">
              <strong>Delivery Type:</strong>{" "}
            </div>
            <div className="col-md-3">
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
              onClick={toggleReturnLayout}
            >
              {activeTab === "returnLayout" ? "Exit" : "Return"}
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
                {/* <span
                className={`tab ms-5 ${
                  activeTab === "creditNote" ? "active" : ""
                }`}
                onClick={() => setActiveTab("creditNote")}
              >
                Credit Note
              </span> */}
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
                      <th>Net Amount</th>
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
                          <td>₹ {product.unit_price?.toFixed(2) || "N/A"}</td>
                          <td>{product.discount_value || "-"}</td>
                          <td>₹ {product.total_tax?.toFixed(2) || "N/A"}</td>
                          <td>₹ {product.unit_price?.toFixed(2) || "N/A"}</td>
                          <td>₹ {product.total_amount?.toFixed(2) || "N/A"}</td>
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
                      <strong>₹ {totalMRP.toFixed(2)}</strong>
                    </span>
                    <span>MRP</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>₹ {totalDiscount.toFixed(2)}</strong>
                    </span>
                    <span>Total Discount</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>₹ {totalTax.toFixed(2)}</strong>
                    </span>
                    <span>Tax Amount</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>₹ {roundOff.toFixed(2)}</strong>
                    </span>
                    <span>Round Off</span>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <span>
                      <strong>₹ {netAmount.toFixed(2)}</strong>
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

          {/* {activeTab === "creditNote" && <div>Credit Note Content</div>} */}

          {activeTab === "returnLayout" && (
            <div>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <table className="table table-hover table-responsive mt-3">
                  <thead className="thead-light">
                    <tr>
                      <th>#</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>MRP</th>
                      <th>Discount</th>
                      <th>Tax</th>
                      <th>Unit Cost</th>
                      <th>Net Amount</th>
                      <th>Return Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((product, index) => {
                      const returnQuantity = returnQuantities[index] || 0;
                      const updatedQuantity = product.quantity - returnQuantity;

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{product.product?.product_code || "N/A"}</td>
                          <td>{product.product?.print_name || "N/A"}</td>
                          <td>{updatedQuantity >= 0 ? updatedQuantity : 0}</td>
                          <td>₹ {product.unit_price?.toFixed(2) || "N/A"}</td>
                          <td>{product.discount_value || "-"}</td>
                          <td>₹ {product.total_tax?.toFixed(2) || "N/A"}</td>
                          <td>₹ {product.unit_price?.toFixed(2) || "N/A"}</td>
                          <td>
                            ₹ {product.payable_amount?.toFixed(2) || "N/A"}
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              max={product.quantity}
                              value={returnQuantity}
                              onChange={(e) =>
                                handleReturnQuantityChange(
                                  index,
                                  Math.min(
                                    parseInt(e.target.value) || 0,
                                    product.quantity
                                  )
                                )
                              }
                              style={{ width: "60px" }}
                            />
                          </td>
                          <td>
                            <Button
                              icon={faExchange}
                              variant="secondary"
                              style={{ width: "60px", margin: "4px" }}
                              onClick={() => setShowModal(true)}
                            ></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="col-md-12">
                {/* <TextInput placeholder="Remarks" label="Remarks" name="Remarks"/> */}
              </div>
              {/* Summary Section for Return Layout */}
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
                  <span>{totalReturnedItems}</span>
                  <span>
                    <strong>Total Returned Items:</strong>
                  </span>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <span>₹ {totalRefundAmount.toFixed(2)}</span>
                  <span>
                    <strong>Total Refund Amount:</strong>{" "}
                  </span>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <span>₹ {totalPayableRefund.toFixed(2)}</span>
                  <span>
                    <strong>Payable Refund Amount:</strong>
                  </span>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <span>
                    <Button
                      icon={faUndo}
                      variant="danger"
                      style={{ width: "100px", margin: "4px" }}
                      onClick={handleReturnAction}
                    >
                      Return
                    </Button>
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Return Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h6>Return quantity</h6>
              <input type="text" placeholder="Enter return quantity" />
            </div>
            <div className="mt-3">
              <h6>Remarks</h6>
              <input type="text" placeholder="Remarks" />
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
