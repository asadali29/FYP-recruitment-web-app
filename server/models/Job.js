const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming the User model includes companies
    required: true,
  },
  applicants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model for applicant IDs
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      selected: {
        type: Boolean,
        default: false, // New field to indicate if the applicant is selected
      },
      interviewDate: {
        type: Date,
        default: null,
      },
      interviewStatus: {
        type: String,
        enum: [
          "Scheduled",
          "Completed",
          "Cancelled",
          "Not Scheduled",
          "Rescheduled",
        ],
        default: "Not Scheduled",
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  numberOfApplicants: {
    type: Number,
    default: 0, // Initialize with 0 applicants
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
