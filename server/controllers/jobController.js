const { validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const Job = require("../models/Job");

const postJob = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, jobType, salary, country, city, postedBy } =
      req.body;

    // Sanitize input
    const sanitizedDescription = sanitizeHtml(description);

    // Create a new job document in the database
    const newJob = new Job({
      title,
      description: sanitizedDescription,
      //   description,
      jobType,
      salary,
      country,
      city,
      postedBy,
    });

    // Save the new job document to the database
    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ success: false, error: "Error posting job" });
  }
};

// Get all jobs belonging to a specific company user
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.user.companyId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    // Check if the logged-in user is the owner of the job
    if (job.companyId !== req.user.companyId) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    await Job.deleteOne({ _id: req.params.id }); // Delete the job document
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, jobType, salary, country, city } = req.body;

    // Find the job by ID
    let job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the logged-in user is the owner of the job
    if (job.companyId !== req.user.companyId) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    // Sanitize input
    const sanitizedDescription = sanitizeHtml(description);

    // Update job fields
    job.title = title;
    job.description = sanitizedDescription;
    job.jobType = jobType;
    job.salary = salary;
    job.country = country;
    job.city = city;

    // Save the updated job
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, error: "Error updating job" });
  }
};

// Function to fetch job details by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to handle job applications
const applyForJob = async (req, res) => {
  try {
    const { userId, name } = req.user;
    const { id } = req.body;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    // Check if the user has already applied for the job
    if (
      job.applicants.some((applicant) => applicant.userId.toString() === userId)
    ) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }
    // Increment the number of applicants
    job.numberOfApplicants += 1;
    job.applicants.push({ userId, name });
    await job.save();
    res.json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  postJob,
  getJobs,
  deleteJob,
  updateJob,
  applyForJob,
  getJobById,
};
