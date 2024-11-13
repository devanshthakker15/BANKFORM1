import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/AuthSlice";
import avatar from "../assets/avatar.jpg";
import "../styles/LoginPage.css";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Button from "../components/Button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  // Redirect to home page if login is successful
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="container">
      <div className="row">
        <h2>Login Page</h2>
      </div>
      <form className="modal-content animate p-2" onSubmit={handleSubmit}>
        <div className="imgcontainer">
          <img src={avatar} alt="Avatar" className="avatar" />
        </div>
        <div>
          <label htmlFor="uname">
            <b>Email</b>
          </label>
          <input
            className="rounded"
            type="text"
            placeholder="Enter Email"
            name="uname"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            className="rounded"
            type="password"
            placeholder="Enter Password"
            name="psw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" text="Login" />
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
