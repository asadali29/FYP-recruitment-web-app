const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  // Job Title
  jobTitle: {
    type: String,
  },

  // Summary
  summary: {
    type: String,
  },

  // Work Experience
  workExperience: [
    {
      company: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      description: {
        type: String,
      },
    },
  ],

  // Education
  education: [
    {
      institution: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldOfStudy: {
        type: String,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  ],

  // Skills
  skills: [
    {
      type: String,
    },
  ],

  // Languages (optional)
  languages: [
    {
      language: {
        type: String,
      },
      fluency: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced", "Native"],
      },
    },
  ],
  // User who created the CV
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const CvModel = mongoose.model("CV", cvSchema);
module.exports = CvModel;
