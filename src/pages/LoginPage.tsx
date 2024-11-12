import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/AuthSlice";
import avatar from "../assets/avatar.jpg";
import "../styles/LoginPage.css";
import { AppDispatch } from "../redux/store";
import { useAppDispatch } from "../redux/hooks";
import Button from "../components/Button";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const dispatch: AppDispatch = useDispatch();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Clear tokens when the component mounts (user visits login page again)
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password });

    const result = await dispatch(loginUser({ email, password, navigate })); // Pass navigate here
    console.log("Dispatch result:", result);

    if (loginUser.fulfilled.match(result)) {
      console.log("Login successful, navigating to home page...");
      navigate("/");
    } else {
      console.log("Login failed, error message:", result.payload);
      alert(result.payload);
    }
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
