const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      title: { type: String, required: true },
      description: { type: String },
      text: { type: String, required: true },
      exampleInput: { type: String },
      exampleOutput: { type: String },
      testCases: [
        {
          input: { type: String },
          expectedOutput: { type: String },
        },
      ],
    },
  ],
  // company: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Company",
  //   required: true,
  // },
  assignedCandidates: [
    // { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
      name: { type: String },
      jobTitle: { type: String },
    },
  ],
});

const Test = mongoose.model("Test", testSchema);
module.exports = Test;
