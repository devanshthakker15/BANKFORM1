import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrdersById } from "../redux/orderSlice";

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { orders, status, error } = useAppSelector((state) => state.orders);
  const order = orders[0]; 

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
      <div className="row">
        <div className="col-md-6">
          <Card title="Order Details">
            <p><strong>Invoice Number:</strong> {order.invoice_code}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Biller Name:</strong> {order.customer_name}</p>
          </Card>
        </div>
        <div className="col-md-6">
          <Card title="Customer Details">
            <p><strong>Name:</strong> {order.customer.name}</p>
          </Card>
        </div>
      </div>
      <div className="col-md-12">
        <Card title="Payment Details">
          <p><strong>Payment Type:</strong> {order.payment_type}</p>
          <p><strong>Total Payable Amount:</strong> ₹ {order.payable_amount}</p>
        </Card>
      </div>
      <div className="col-md-12">
        <Card title="Order Actions">
          <Button variant="primary" style={{ marginRight: "10px" }}>
            <FontAwesomeIcon icon={faPrint} /> Print Bill
          </Button>
          <Button variant="danger">
            <FontAwesomeIcon icon={faUndo} /> Return Order
          </Button>
        </Card>
      </div>
      <div className="col-md-12">
        <Card title="Product Details">
          {order.products.map((product, index) => (
            <div key={index}>
              <p><strong>Product Name:</strong> {product.product.print_name}</p>
              <p><strong>Product Code:</strong> {product.product.product_code}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Total Amount:</strong> ₹ {product.total_amount}</p>
              <p><strong>Total Tax:</strong> ₹ {product.total_tax}</p>
              <p><strong>Payable Amount:</strong> ₹ {product.payable_amount}</p>
              <hr />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
