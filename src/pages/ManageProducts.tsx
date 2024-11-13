import React, { useState, useEffect } from "react";
import "../App.css";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Loader from "../components/Loader";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import axios from "axios";
import Button from "../components/Button";

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const sliceTitle = (title: string) => {
    return title.length > 25 ? title.substring(0, 25) + "..." : title;
  };

  const handleShow = (product: any) => {
    setSelectedProduct(product);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} color="gold" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} color="gold" />);
      } else {
        stars.push(<FaRegStar key={i} color="gold" />);
      }
    }
    return stars;
  };

  return (
    <div>
      {products.length > 0 ? (
        <div className="container">
          <h1>Manage Products</h1>
          <div className="row">
            {products.map((product) => (
              <div className="col-md-3 clickable-card">
                <div
                  className="card"
                  style={{ cursor: "pointer" }}
                  key={product.id}
                  onClick={() => handleShow(product)}
                >
                  <img
                    src={product.image}
                    className="productcard-img-top"
                    alt={product.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <strong>{sliceTitle(product.title)}</strong>
                    </h5>
                    <br />
                    <p className="card-text">
                      <strong>Price: </strong>${product.price}
                    </p>
                    <p className="card-text">
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p className="card-text">
                      <strong>Rating:</strong>{" "}
                      {renderStars(product.rating.rate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedProduct && (
            <Modal show={show} onHide={handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>{selectedProduct.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex">
                <div className="col-md-6">
                  <img
                    src={selectedProduct.image}
                    className="img-fluid"
                    alt={selectedProduct.title}
                  />
                </div>
                <div className="col-md-6">
                  <p className="card-text">
                    <strong>Description:</strong> {selectedProduct.description}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> ${selectedProduct.price}
                  </p>
                  <p className="card-text">
                    <strong>Category:</strong> {selectedProduct.category}
                  </p>
                  <p className="card-text">
                    <strong>Rating:</strong>{" "}
                    {renderStars(selectedProduct.rating.rate)}
                  </p>
                  <p className="card-text">
                    <strong>
                      Hurry Up! Only {selectedProduct.rating.count} left in
                      stock
                    </strong>
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  text="Close"
                  variant="secondary"
                  onClick={handleClose}
                />
              </Modal.Footer>
            </Modal>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ManageProducts;
