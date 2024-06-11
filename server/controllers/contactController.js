const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

dotenv.config();

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const emailAddress = process.env.EMAIL_ADDRESS;

sgMail.setApiKey(sendgridApiKey);

const sendContactEmail = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { fullName, email, subject, message } = req.body;
  // Sanitize user input to prevent XSS attacks
  const sanitizedMessage = sanitizeHtml(message);
  const htmlMessage = `
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong> ${sanitizedMessage}</p>
  `;
  const msg = {
    to: emailAddress,
    from: {
      name: "HIREEAZE",
      email: emailAddress,
    },
    replyTo: email,
    subject: subject,
    html: htmlMessage,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

module.exports = { sendContactEmail };
