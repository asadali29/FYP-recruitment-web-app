const Test = require("../models/Test");
// const Question = require("../models/Question");
const CandidateAnswer = require("../models/CandidateAnswer");
const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

const createTest = async (req, res) => {
  try {
    const { title, description, questions, assignedCandidates } = req.body;
    const test = new Test({
      title,
      description,
      questions,
      assignedCandidates,
    });
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: "Error creating test" });
  }
};

const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    // Find and delete the test by ID
    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTestsListForCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    // const { testId } = req.query;
    const tests = await Test.find({ "assignedCandidates.id": candidateId });
    // const tests = await Test.find({
    //   $and: [{ "assignedCandidates.id": candidateId }, { _id: testId }],
    // });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests" });
  }
};

const getTestForCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { testId } = req.query;
    //   const tests = await Test.find({ "assignedCandidates.id": candidateId });
    const tests = await Test.find({
      $and: [{ "assignedCandidates.id": candidateId }, { _id: testId }],
    });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests" });
  }
};

const assignTest = async (req, res) => {
  try {
    const { testId, candidateId } = req.body;
    const test = await Test.findById(testId);
    test.assignedCandidates.push(candidateId);
    await test.save();
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: "Error assigning test" });
  }
};

const evaluateCode = async (req, res) => {
  try {
    const { code, questionId } = req.body;
    const {
      candidateId,
      testId,
      isFinal,
      questionTitle,
      questionDesc,
      questionText,
    } = req.body;

    // Find the test containing the question
    const test = await Test.findOne({ "questions._id": questionId });

    if (!test) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Find the specific question within the test
    const question = test.questions.id(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    let allTestCasesPassed = true;
    const results = [];

    // Iterate through each test case
    for (const testCase of question.testCases) {
      const { input, expectedOutput } = testCase;
      //   const formattedInput = JSON.stringify(input);
      console.log("UnFormatted input:", input);
      // const formattedInput = JSON.stringify(input);
      // const formattedInput = `"${input}"`;
      const formattedInput = input.toString();
      console.log("Formatted input:", formattedInput);

      // console.log("Raw Input:", formattedInput);
      // console.log("Type of input:", typeof formattedInput);
      // console.log("Is Array:", Array.isArray(formattedInput));

      const convertString = (str) => {
        // Trim any extra spaces
        const trimmedStr = str.trim();

        // Check if the string represents a number
        if (!isNaN(trimmedStr)) {
          return Number(trimmedStr);
        }

        // Check if the string represents an array
        try {
          // trimmedStr = '"' + trimmedStr + '"';
          const parsedArray = JSON.parse(trimmedStr);
          // console.log("parsedarray ", parsedArray);
          // console.log("parsedarray type ", typeof parsedArray);
          if (Array.isArray(parsedArray)) {
            return trimmedStr;
          }
        } catch (e) {
          // Parsing failed; not an array
          console.log("parse failed");
        }
        // }

        // If it's neither a number nor an array, return the string itself
        // trimmedStr = `'${trimmedStr}'`;
        const newtrimmedStr = '"' + trimmedStr + '"';
        // console.log("string trim", newtrimmedStr);
        return newtrimmedStr;
      };

      // const newFormattedInput = convertString(formattedInput);
      // sample = "[1,2,4,5]";
      const newFormattedInput = convertString(formattedInput);
      // console.log("Raw: ", newFormattedInput);
      // console.log("type: ", typeof newFormattedInput);
      // console.log(Array.isArray(newFormattedInput));

      const execCode = `
      try {
        ${code}
        console.log(${
          question.text.match(/function\s+(\w+)/)[1]
        }(${newFormattedInput}));
        } catch (error) {
           console.error(error);
        }
      `;

      // console.log("Executing code:", execCode);

      try {
        const { stdout, stderr } = await execPromise(
          // `node -e "${execCode.replace(/"/g, '\\"')}"`
          `node -e "${execCode.replace(/"/g, '\\"').replace(/\n/g, "")}"`
        );

        // console.log("stdout ouput: ", stdout);
        const trimmedOutput = stdout.trim();
        // console.log("trimmed ouput: ", trimmedOutput);

        const passed = trimmedOutput === expectedOutput;
        allTestCasesPassed = allTestCasesPassed && passed;

        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: trimmedOutput,
          errorOutput: stderr ? stderr.trim() : null,
          passed,
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          errorOutput: error.message,
          passed: false,
        });
        allTestCasesPassed = false;
      }
    }

    // Save the candidate's answer to the database
    const candidateAnswer = new CandidateAnswer({
      candidateId,
      testId,
      questionId,
      questionTitle,
      questionDesc,
      questionText,
      code,
      results,
      isCorrect: allTestCasesPassed,
      isFinal: isFinal,
    });

    await candidateAnswer.save();

    res.status(200).json({ isCorrect: allTestCasesPassed, results });
    // res.status(200).json({ passed: allTestCasesPassed, results });
  } catch (error) {
    console.error("Error evaluating code:", error);
    res.status(500).json({ message: "Error evaluating code" });
  }
};

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tests" });
  }
};

const generateReport = async (req, res) => {
  try {
    const { candidateId, testId } = req.params;

    // Fetch the test details
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Fetch candidate's answers
    const candidateAnswers = await CandidateAnswer.find({
      candidateId: candidateId,
      testId: testId,
    });

    if (candidateAnswers.length === 0) {
      return res
        .status(404)
        .json({ message: "No answers found for this candidate" });
    }

    // Build the report
    const reportData = {
      candidateId,
      testId,
      testTitle: test.title,
      testDescription: test.description,
      createdAt: test.createdAt,
      answers: candidateAnswers.map((answer) => ({
        questionTitle: answer.questionTitle,
        questionDescription: answer.questionDesc,
        submittedCode: answer.code,
        isFinal: answer.isFinal,
        results: answer.results,
      })),
    };

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTest,
  deleteTest,
  assignTest,
  getTestsListForCandidate,
  getTestForCandidate,
  evaluateCode,
  getAllTests,
  generateReport,
};
