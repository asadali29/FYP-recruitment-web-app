const Job = require("../models/Job");

// Schedule Interview
const scheduleInterview = async (req, res) => {
  try {
    const { userId, jobId, interviewDate } = req.body;
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

    applicant.interviewDate = new Date(interviewDate);
    applicant.interviewStatus = "Scheduled";
    await job.save();
    res.json({ success: true, applicant });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Interview Status
const updateInterview = async (req, res) => {
  try {
    const { userId, jobId, interviewStatus } = req.body;
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

    // if (interviewStatus === "Cancelled" || interviewStatus === "Completed") {
    //   applicant.interviewDate = null; // Clear the interview date
    // }
    // applicant.interviewStatus = interviewStatus;

    // Update interview status and completion flag
    applicant.interviewStatus = interviewStatus;
    if (interviewStatus === "Completed") {
      applicant.completed = true;
      applicant.interviewDate = null; // Clear the interview date
    } else if (interviewStatus === "Cancelled") {
      applicant.interviewDate = null; // Clear the interview date
    }
    await job.save();
    res.json({ success: true, applicant });
  } catch (error) {
    console.error("Error updating interview status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reschedule Interview
const rescheduleInterview = async (req, res) => {
  try {
    const { userId, jobId, newInterviewDate } = req.body;
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

    // Update the interview date and set status to "Rescheduled"
    applicant.interviewDate = new Date(newInterviewDate);
    applicant.interviewStatus = "Rescheduled";
    await job.save();
    res.json({ success: true, applicant });
  } catch (error) {
    console.error("Error rescheduling interview:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch Interview Details
const getInterviewDetails = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
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

    res.json(applicant);
  } catch (error) {
    console.error("Error fetching interview details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get interview for candidate
const getCandidateInterviews = async (req, res) => {
  try {
    // const userId = req.user.id;
    const { userId } = req.user;
    const jobs = await Job.find({ "applicants.userId": userId });

    const interviews = jobs
      .map((job) => {
        const applicant = job.applicants.find(
          (app) => app.userId.toString() === userId
        );
        return {
          jobId: job._id,
          jobTitle: job.title,
          candidateId: applicant.userId._id,
          interviewDate: applicant.interviewDate,
          interviewStatus: applicant.interviewStatus,
        };
      })
      .filter((interview) => interview.interviewDate);

    res.json(interviews);
  } catch (error) {
    console.error("Error fetching candidate interviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get interview for Company
const getCompanyInterviews = async (req, res) => {
  try {
    const { userId } = req.user;
    const jobs = await Job.find({ postedBy: userId });

    const interviews = jobs.flatMap((job) =>
      job.applicants
        .filter((applicant) => applicant.interviewDate)
        .map((applicant) => ({
          jobId: job._id,
          jobTitle: job.title,
          candidateId: applicant.userId._id,
          candidateName: applicant.name,
          interviewDate: applicant.interviewDate,
          interviewStatus: applicant.interviewStatus,
        }))
    );

    res.json(interviews);
  } catch (error) {
    console.error("Error fetching company interviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  scheduleInterview,
  updateInterview,
  rescheduleInterview,
  getInterviewDetails,
  getCandidateInterviews,
  getCompanyInterviews,
};
