import React, { useState } from "react";
import "./css/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandle = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    let responseData;
    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => (responseData = data));
    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("Signup Function Executed", formData);
    let responseData;
    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => (responseData = data));
    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className="loginsignup-container">
      <h2>{state}</h2>
      <div className="loginsignup-fields">
        {state === "Sign Up" ? (
          <input
            name="username"
            value={formData.username}
            onChange={changeHandle}
            type="text"
            placeholder="Your Name"
          />
        ) : (
          <></>
        )}
        <input
          name="email"
          value={formData.email}
          onChange={changeHandle}
          type="email"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={formData.password}
          onChange={changeHandle}
          type="password"
          placeholder="Password"
        />
      </div>
      <button
        onClick={() => {
          state === "Login" ? login() : signup();
        }}
      >
        Continue
      </button>
      {state === "Sign Up" ? (
        <p className="loginsignup-login">
          Already have an account?{" "}
          <span
            onClick={() => {
              setState("Login");
            }}
          >
            Login here
          </span>
        </p>
      ) : (
        <p className="loginsignup-login">
          Create an account?{" "}
          <span
            onClick={() => {
              setState("Sign Up");
            }}
          >
            Click here
          </span>
        </p>
      )}
      <div className="loginsignup-agree">
        <input type="checkbox" />
        <p>By continuing, I agree to the terms of use & privacy policies</p>
      </div>
    </div>
  );
};

export default LoginSignup;
