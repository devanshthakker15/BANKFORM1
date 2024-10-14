import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; 
import avatar from "../assets/avatar.jpg";

interface User {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const getStoredUsers = (): User[] => {
    const users = localStorage.getItem("users");
    try {
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Failed to parse users from localStorage:", error);
      return []; // Return empty array if parsing fails
    }
  };

  const setStoredUsers = (users: User[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleRegister = () => {
    const users = getStoredUsers();

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      alert("User already exists! Please choose a different username.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newUser: User = { username, password };
    const updatedUsers = [...users, newUser];
    setStoredUsers(updatedUsers);
    alert("Registration successful!");
    setIsLoginMode(true);
  };

  const handleLogin = () => {
    const users = getStoredUsers();

    const user = users.find((user) => user.username === username);
    if (!user) {
      alert("User not found! Please register.");
      return;
    }

    if (user.password === password) {
      navigate("/home");
    } else {
      alert("Incorrect password");
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <h2>{isLoginMode ? "Login" : "Register"} Page</h2>
      <form className="modal-content animate p-2" onSubmit={handleSubmit}>
        <div className="imgcontainer">
          <img src={avatar} alt="Avatar" className="avatar" />
        </div>

        <div className="container">
          <label htmlFor="uname">
            <b>Username</b>
          </label>
          <input
            className="rounded"
            type="text"
            placeholder="Enter Username"
            name="uname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          {!isLoginMode && (
            <>
              <label htmlFor="confirmPsw">
                <b>Confirm Password</b>
              </label>
              <input
                className="rounded"
                type="password"
                placeholder="Confirm Password"
                name="confirmPsw"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}

          <button className="submit rounded" type="submit">
            {isLoginMode ? "Login" : "Register"}
          </button>
          <label>
            <input type="checkbox" name="remember" defaultChecked /> Remember me
          </label>
        </div>

        <div className="container" style={{ backgroundColor: "#f1f1f1" }}>
          <button type="button" onClick={toggleMode} className="cancelbtn rounded">
            {isLoginMode ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
