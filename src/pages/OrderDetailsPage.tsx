// OrderDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import { apiGetBankDataById } from "../utils/getApi";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faUndo } from "@fortawesome/free-solid-svg-icons";
import { fetchActiveStores } from "../redux/storeSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface Customer {
  name: string;
  contact_number: number;
  email: string;
  company_name: string;
}

interface Employee {
  first_name: string;
  last_name: string;
}

interface PaymentType {
  payment_type: string;
}

interface Product {
  product: {
    print_name: string;
    product_code: string;
  };
  quantity: number;
  total_amount: number;
  total_tax: number;
  payable_amount: number;
}

interface Order {
  invoice_code: string;
  status: string;
  created_at: string;
  payable_amount: number;
  delivery_type: string;
  payment_type: PaymentType;
  customer: Customer;
  employee: Employee;
  products: Product[];
}

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await apiGetBankDataById(`/api/orders/manage/${id}`);
        setOrder(response.result);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <Loader />;
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
            <p><strong>Biller Name:</strong> {order.employee.first_name} {order.employee.last_name}</p>
          </Card>
        </div>
        <div className="col-md-6">
          <Card title="Customer Details">
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Mobile Number:</strong> {order.customer.contact_number}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Company Name:</strong> {order.customer.company_name}</p>
          </Card>
        </div>
      </div>
      <div className="col-md-12">
        <Card title="Payment Details">
          <p><strong>Payment Type:</strong> {order.payment_type.payment_type}</p>
          <p><strong>Delivery Type:</strong> {order.delivery_type}</p>
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
