const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const contactController = require("../controllers/contactController");
const dashboardController = require("../controllers/dashboardController");
const verifyToken = require("../middleware/authMiddleware");
const { upload, compressImage } = require("../middleware/upload");
const {
  createCv,
  checkCV,
  getCvByUserId,
} = require("../controllers/cvController");
const {
  postJob,
  getJobs,
  deleteJob,
  updateJob,
  applyForJob,
  getJobById,
} = require("../controllers/jobController");
// const { toggleSelection } = require("../controllers/applicationController");
const {
  toggleSelection,
  getSelectedApplicants,
} = require("../controllers/applicationController");
// const upload = require("../middleware/upload");
const path = require("path");
const UserModel = require("../models/User");
const router = express.Router();

// Serve static files from the 'uploads' directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .isIn(["Company", "Candidate"])
      .withMessage("Invalid user role"),
  ],
  authController.register
);
router.post("/login", authController.login);

router.post(
  "/contact",
  [
    body("fullName").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  contactController.sendContactEmail
);

router.get("/dashboard", verifyToken, (req, res) => {
  // Access user information from req.user
  const { userId, username, role, name, email, profilePicture } = req.user;
  res.json({ userId, username, role, name, email, profilePicture });
});

router.put(
  "/dashboard",
  verifyToken,
  upload.single("profilePicture"),
  compressImage,
  dashboardController.updateUserData
);

router.get("/user-profile", verifyToken, dashboardController.updatedUserData);

// POST route to create a new CV
router.post("/create-cv", createCv);

// Endpoint to check if the user has a CV
router.get("/check-cv", verifyToken, checkCV);

// Endpoint to fetch CV data by user ID
router.get("/cv/:userId", getCvByUserId);

// POST route to create new job post
router.post(
  "/create-job-posts",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("jobType").trim().notEmpty().withMessage("Job type is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
  ],
  verifyToken,
  postJob
);
// router.post("/create-job-posts", postJob);

// GET all jobs belonging to the logged-in company user
router.get("/job-posts", verifyToken, getJobs);

// DELETE a job by ID
router.delete("/job-posts/:id", verifyToken, deleteJob);

// UPDATE job route
router.put(
  "/job-posts/:id",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("jobType").trim().notEmpty().withMessage("Job type is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
  ],
  verifyToken,
  updateJob
);

// Endpoint to fetch job details by ID
router.get("/job-details/:id", getJobById);

// Endpoint to handle job applications
// router.post("/job-details/apply", applyForJob);
router.post("/job-details/apply", verifyToken, applyForJob);

// Toggle selection status
router.patch("/toggle-selection", verifyToken, toggleSelection);

// Get selected applicants
router.get("/selected-applicants/:jobId", verifyToken, getSelectedApplicants);

// Toggle selection status
// router.patch("/api/toggle-selection/:userId", toggleSelection);

module.exports = router;
