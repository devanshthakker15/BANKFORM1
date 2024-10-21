import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; 
import avatar from "../assets/avatar.jpg";
// import perms from "../utils/perms"; // Import the permissions
import perms from "../utils/perms";

interface User {
  username: string;
  password: string;
  userType: string;
  permissions: string[];
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

  const handleLogin = () => {
    const user = perms.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid username or password!");
      return;
    }

    // Store user details in localStorage upon successful login
    localStorage.setItem("currentUser", JSON.stringify(user));
    navigate("/");
  };

  const handleRegister = () => {
    // Registration logic is not being updated here since perms.ts is used for user management
    alert("Registration is disabled in this version");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container">
      <div className="row">
        <h2>{isLoginMode ? "Login" : "Register"} Page</h2>
        {/* <button type="button" onClick={toggleMode} className="can rounded">
          {isLoginMode ? "Switch to Register" : "Switch to Login"}
        </button> */}
      </div>

      <form className="modal-content animate p-2" onSubmit={handleSubmit}>
        <div className="imgcontainer">
          <img src={avatar} alt="Avatar" className="avatar" />
        </div>

        <div>
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
          {/* <label>
            <input type="checkbox" name="remember" defaultChecked /> Remember me
          </label> */}
          
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
