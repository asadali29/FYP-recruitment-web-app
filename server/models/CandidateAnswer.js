const mongoose = require("mongoose");

const CandidateAnswerSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  questionTitle: {
    type: String,
  },
  questionDesc: {
    type: String,
  },
  questionText: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  results: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      errorOutput: String,
      passed: Boolean,
    },
  ],
  isCorrect: {
    type: Boolean,
    required: true,
  },
  isFinal: {
    type: Boolean,
    // default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CandidateAnswer = mongoose.model(
  "CandidateAnswer",
  CandidateAnswerSchema
);
module.exports = CandidateAnswer;
