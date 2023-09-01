import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../Auth.css";
import { Alert } from "react-bootstrap";
import callApi from "../../../core/ApiMethods";
import { useNavigate } from "react-router-dom";
import loginHelperImg from "../../../assets/login-helper.jpg";

function Login() {
  // make a state for storing values of form
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  // make a state for store error and display them
  const [error, setError] = useState({
    display: false,
    message: "",
  });
  const [login, setLogin] = useState("Login");
  const { username, password } = state;
  const { display, message } = error;
  /**
   * make a method that stores form input value into state
   * @param {*} value input value by user
   * @param {*} name name of that state
   */ 
  const handleStateChange = (value, name) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const loginHandler = (e) => {
    e.preventDefault();
    // check basic validation
    if (username === "" || password === "") {
      setError({
        display: true,
        message: "Please fill in both username and password fields.",
      });
    } else {
      setLogin("Logging...");
      setError({
        display: false,
        message: "",
      });
      let payload = {
        username: username.trim(),
        password: password.trim(),
      };
      // callApi method that taken end point and payload
      callApi("POST", "auth/login", payload).then((res) => {
        setLogin("Login");
        if (res.token) {
          sessionStorage.setItem("user_token", res.token);
          navigate("/panel/home");
        } else {
          setError({
            display: true,
            message: "username or password is incorrect",
          });
        }
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-LeftSide">
        <img
          className="login-image"
          src={loginHelperImg}
          alt="loginHelperImg"
        />
      </div>
      <div className="login-RightSide">
        <h1 className="text-center" style={{ color: "#007DFE" }}>
          Welcome To Ecommerce App
        </h1>
        <div style={{ width: "100%" }} className="form-container mt-3">
          <Form>
            <h1>Login</h1>
            <hr></hr>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={(e) => {
                  handleStateChange(e.target.value, "username");
                }}
                type="text"
                placeholder="Enter username"
                value={username}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={(e) => {
                  handleStateChange(e.target.value, "password");
                }}
                type="password"
                placeholder="Password"
                value={password}
              />
            </Form.Group>
            <Button
              onClick={loginHandler}
              variant="primary"
              type="submit"
              style={{ width: "100%" }}
            >
              {login}
            </Button>
            <p className="mt-3">
              Note*: login credentials username :{" "}
              <span className="fw-bold">mor_2314</span> and password :{" "}
              <span className="fw-bold">83r5^_</span>
            </p>
          </Form>
        </div>
        <div style={{ width: "100%" }} className="alertBanner">
          {display && <Alert variant="warning">{message}</Alert>}
        </div>
      </div>
    </div>
  );
}

export default Login;
