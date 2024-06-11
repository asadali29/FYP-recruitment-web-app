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
  applicants: [
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // Reference to the User model for applicant IDs
    // },
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
