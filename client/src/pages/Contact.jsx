import { useState } from "react";
import axios from "axios";
import {
  validateContactForm,
  removeSuccessFor,
} from "../scripts/formValidation";
import SuccessPopup from "../components/SuccessPopup";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateContactForm();

    try {
      await axios.post("http://localhost:3001/contact", formData);
      console.log("Email sent successfully");
      // Reset form data to empty
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
      // Remove inputs border color
      removeSuccessFor();
      // Show the success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error sending email", error);
    }
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="contact-cont">
      <div className="contact-text-cont">
        <h1>Discover the Power of Connection</h1>
        <p>
          We thrive on the energy of meaningful connections. Your message is
          more than words, it's an opportunity to shape the future together.
        </p>
        <p>
          Use the form to share your thoughts, inquiries, or even a friendly
          'hello.' We're here to listen.
        </p>
      </div>
      <div className="contact-form-cont">
        <h2>Drop us a line !!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name *"
              id="contactFullName"
            />
            <small className="error-message">Error message</small>
          </div>
          <div className="form-control">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email *"
              id="contactEmail"
            />
            <small className="error-message">Error message</small>
          </div>
          <div className="form-control">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject *"
              id="contactSubject"
            />
            <small className="error-message">Error message</small>
          </div>
          <div className="form-control">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message *"
              rows="4"
              id="contactMessage"
            ></textarea>
            <small className="error-message">Error message</small>
          </div>
          <button type="submit" className="btnContactForm">
            Send Message
          </button>
        </form>
        {/* Conditionally display SuccessPopup */}
        {showSuccessPopup && <SuccessPopup onClose={closeSuccessPopup} />}
      </div>
    </div>
  );
}
