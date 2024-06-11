const Job = require("../models/Job");

// Toggle selection status of an applicant
const toggleSelection = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicant = job.applicants.find(
      (app) => app.userId.toString() === userId
    );
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    applicant.selected = !applicant.selected;
    await job.save();
    res.json({ success: true, applicant });
  } catch (error) {
    console.error("Error toggling selection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch selected applicants for a job
const getSelectedApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const selectedApplicants = job.applicants.filter((app) => app.selected);
    res.json(selectedApplicants);
  } catch (error) {
    console.error("Error fetching selected applicants:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  toggleSelection,
  getSelectedApplicants,
};
