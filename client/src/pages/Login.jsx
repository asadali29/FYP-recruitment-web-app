import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import coverImage from "../assets/bglogin.jpg";
import { validateLoginForm, removeSuccessFor } from "../scripts/formValidation";
import SuccessPopup from "../components/SuccessPopup";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateLoginForm();
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data.token) {
          // Remove inputs border color
          removeSuccessFor();
          // Store the token in local storage
          localStorage.setItem("token", result.data.token);
          // localStorage.setItem("userId", result.data.token.userId);
          // localStorage.removeItem("profileImage");
          console.log("Token stored:", localStorage.getItem("token"));
          // Show the success popup
          setShowSuccessPopup(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        }

        // if (result.data === "Success") {
        //   // Remove inputs border color
        //   removeSuccessFor();
        //   // Show the success popup
        //   setShowSuccessPopup(true);
        //   setTimeout(() => {
        //     navigate("/dashboard");
        //   }, 3000);
        // }
      })
      .catch((err) => console.log(err));
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="container-login">
      <div className="cont-img">
        <div className="overlay"></div>
        <Link to="/" className="logo-only">
          HIREEAZE
        </Link>
        <h1 className="img-text">Welcome Back. Log In to Your Account</h1>
        <img src={coverImage} className="cover-img" />
      </div>
      <div className="cont-login">
        <h2 className="login-heading">Sign in to Hireeaze</h2>
        <div className="form-cont">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="email" className="loginLabel">
                <strong>Email address</strong>
              </label>
              <input
                type="email"
                autoComplete="off"
                name="email"
                className="logininput"
                id="loginEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="error-message">Error message</small>
            </div>
            <div className="form-control">
              <label htmlFor="password" className="loginLabel">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                name="password"
                className="logininput"
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small className="error-message">Error message</small>
            </div>
            <button type="submit" className="btnLoginAccount">
              Sign in
            </button>
          </form>
          {/* Conditionally render the SuccessPopup */}
          {showSuccessPopup && <SuccessPopup onClose={closeSuccessPopup} />}
          <div className="form-cont-lower">
            <p className="form-lower-para">New to hireeaze?</p>
            <Link to="/register" className="btnRegisterPage">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
