import React, { useEffect } from "react";
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

  // const printPDF = (base64EncodedData: string) => {
  //   const pdfWindow = window.document.write(
  //     `<iframe width="100%" height="100%" src="data:application/pdf;base64,${base64EncodedData}" frameborder="0" allowfullscreen></iframe>`
  //   );
    
  //     pdfWindow.print();
  //   }
  // };
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
    }
  }, [id, dispatch]);

  if (status === "loading") {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>No order details available.</div>;
  }

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
          <Button
            icon={faUndo}
            variant="danger"
            style={{ width: "100px", margin: "4px" }}
          >
            Return
          </Button>
        </Card>
      </div>
      <div className="col-md-12">
        <Card title="Product Details">
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <table className="table table-hover mt-3">
              <thead style={{ backgroundColor: "black", color: "white" }}>
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
                      <td>₹ {product.total_amount || "N/A"}</td>
                      <td>{product.discount_value || "N/A"}</td>
                      <td>₹ {product.total_tax || "N/A"}</td>
                      <td>₹ {product.unit_price || "N/A"}</td>
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
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
