import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import coverImage from "../assets/bgsignup.jpg";
import {
  validateSignupForm,
  removeSuccessFor,
  removeRadioSuccessFor,
} from "../scripts/formValidation";
import SuccessPopup from "../components/SuccessPopup";

function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [radioOption, setRadioOption] = useState("");
  const [isHoveredCompany, setIsHoveredCompany] = useState(false);
  const [isHoveredCandidate, setIsHoveredCandidate] = useState(false);
  const navigate = useNavigate();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateSignupForm();
    axios
      .post("http://localhost:3001/register", {
        name,
        username,
        email,
        password,
        role: radioOption,
      })
      .then((result) => {
        console.log(result);
        // Remove inputs border color
        removeSuccessFor();
        removeRadioSuccessFor();
        // Show the success popup
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="container-sinup">
      <div className="cont-img">
        <div className="overlay"></div>
        <Link to="/" className="logo-only">
          HIREEAZE
        </Link>
        <h1 className="img-text">Embark on Your Next Chapter. Sign Up Now</h1>
        <img src={coverImage} className="cover-img" />
      </div>
      <div className="cont-signup">
        <h2 className="signup-heading">Create an account</h2>
        <div className="form-cont">
          <form onSubmit={handleSubmit}>
            {/* FULL NAME */}
            <div className="form-control">
              <label htmlFor="name" className="signupLabel">
                <strong>Full Name *</strong>
              </label>
              <input
                type="text"
                autoComplete="off"
                name="name"
                className="signupinput"
                id="signupFullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small className="error-message">Error message</small>
            </div>
            {/* USERNAME */}
            <div className="form-control">
              <label htmlFor="username" className="signupLabel">
                <strong>Username *</strong>
              </label>
              <input
                type="text"
                autoComplete="off"
                name="username"
                className="signupinput"
                id="signupUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <small className="error-message">Error message</small>
            </div>
            {/* EMAIL */}
            <div className="form-control">
              <label htmlFor="email" className="signupLabel">
                <strong>Email *</strong>
              </label>
              <input
                type="email"
                autoComplete="off"
                name="email"
                className="signupinput"
                id="signupEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="error-message">Error message</small>
            </div>
            {/* PASSWORD */}
            <div className="form-control">
              <label htmlFor="password" className="signupLabel">
                <strong>Password *</strong>
              </label>
              <input
                type="password"
                name="password"
                className="signupinput"
                id="signupPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small className="error-message">Error message</small>
            </div>
            {/* RADIO BTN (Company OR Candidate) */}
            <div>
              <label htmlFor="radio" className="signupLabel">
                <strong>
                  Who are you? * <span>(Choose one)</span>
                </strong>
              </label>
              <div className="radiobtn-container">
                <div
                  className={`radio-box ${
                    radioOption === "Company" ? "checked" : ""
                  } ${isHoveredCompany ? "hovered" : ""}`}
                  onMouseEnter={() => setIsHoveredCompany(true)}
                  onMouseLeave={() => setIsHoveredCompany(false)}
                >
                  <input
                    type="radio"
                    name="radio-group"
                    className="radiobtn"
                    value="Company"
                    checked={radioOption === "Company"}
                    onChange={(e) => setRadioOption(e.target.value)}
                  />
                  <label
                    htmlFor="radio-group"
                    className={`radiolabel ${
                      radioOption === "Company" ? "checked" : ""
                    }`}
                  >
                    Company
                  </label>
                </div>
                <div
                  className={`radio-box ${
                    radioOption === "Candidate" ? "checked" : ""
                  } ${isHoveredCandidate ? "hovered" : ""}`}
                  onMouseEnter={() => setIsHoveredCandidate(true)}
                  onMouseLeave={() => setIsHoveredCandidate(false)}
                >
                  <input
                    type="radio"
                    name="radio-group"
                    className="radiobtn"
                    value="Candidate"
                    checked={radioOption === "Candidate"}
                    onChange={(e) => setRadioOption(e.target.value)}
                  />
                  <label
                    htmlFor="radio-group"
                    className={`radiolabel ${
                      radioOption === "Candidate" ? "checked" : ""
                    }`}
                  >
                    Candidate
                  </label>
                </div>
                <small className="error-message">Error message</small>
              </div>
            </div>
            {/* SUBMIT BUTTON */}
            <button type="submit" className="btnCreateAccount">
              Create account
            </button>
          </form>
          {/* Conditionally render the SuccessPopup */}
          {showSuccessPopup && <SuccessPopup onClose={closeSuccessPopup} />}
          <div className="form-cont-lower">
            <p className="form-lower-para">Already Have an Account?</p>
            {/* LOGIN PAGE BTN */}
            <Link to="/login" className="btnLoginPage">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
