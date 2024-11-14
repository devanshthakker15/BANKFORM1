import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/AuthSlice";
import avatar from "../assets/avatar.jpg";
import "../styles/LoginPage.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Button from "../components/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../schema/loginSchema";
import Modal from "react-bootstrap/Modal";
import TextInput from "../components/TextInput";


const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loginError = useAppSelector((state) => state.auth.loginError); 
  const isLoading = useAppSelector((state) => state.auth.loading);
  const [showModal, setShowModal] = useState(false);



  const initialValues = {
    email: "",
    password: "",
  };



  const handleSubmit = async (values: typeof initialValues) => {
    dispatch(loginUser(values));
    setShowModal(true);
  };

  React.useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container">
      <div className="row">
        <h2>Login Page</h2>
      </div>
      <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="modal-content animate p-2">
            <div className="imgcontainer">
              <img src={avatar} alt="Avatar" className="avatar" />
            </div>
            <div>
              <TextInput label="Email" name="email" placeholder="Enter Email" />
              <TextInput label="Password" name="password" type="password" placeholder="Enter Password" />
              <Button type="submit" text={isLoading ? "Logging In..." : "Login"} disabled={isSubmitting || isLoading} />
            </div>
          </Form>
        )}
      </Formik>
      <Modal show={showModal && !isLoading} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "15px", color: "red" }}>Try again!! {loginError}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginPage;