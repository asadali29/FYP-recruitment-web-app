import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateTest = () => {
  const initialQuestion = {
    title: "",
    description: "",
    text: "",
    exampleInput: "",
    exampleOutput: "",
    testCases: [{ input: "", expectedOutput: "" }],
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([initialQuestion]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/company-interviews", {
          headers: { Authorization: token },
        });
        const uniqueCandidates = response.data.reduce((acc, candidate) => {
          if (!acc.some((item) => item.candidateId === candidate.candidateId)) {
            acc.push(candidate);
          }
          return acc;
        }, []);
        setCandidates(uniqueCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleTestCaseChange = (questionIndex, testCaseIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].testCases[testCaseIndex][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, initialQuestion]);
  };

  const handleAddTestCase = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].testCases.push({ input: "", expectedOutput: "" });
    setQuestions(newQuestions);
  };

  const handleCandidateChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCandidates((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setQuestions([initialQuestion]);
    setSelectedCandidates([]);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const selectedCandidatesDetails = candidates
        .filter((candidate) =>
          selectedCandidates.includes(candidate.candidateId)
        )
        .map((candidate) => ({
          id: candidate.candidateId,
          name: candidate.candidateName,
          jobTitle: candidate.jobTitle,
        }));
      await axios.post(
        "/api/create-test",
        {
          title,
          description,
          questions,
          // assignedCandidates: selectedCandidates,
          assignedCandidates: selectedCandidatesDetails,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Test created successfully!");
      resetForm(); // Reset form fields after successful submission
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  return (
    <div className="create-test-container">
      <h2>
        <span>Create Test</span>
      </h2>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Test Title"
      />
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Test Description"
      />
      <h4>Questions</h4>
      {questions.map((question, index) => (
        <div key={index} className="create-test-inner-cont">
          <input
            type="text"
            value={question.title}
            onChange={(e) =>
              handleQuestionChange(index, "title", e.target.value)
            }
            placeholder="Question Title"
          />
          <textarea
            value={question.description}
            onChange={(e) =>
              handleQuestionChange(index, "description", e.target.value)
            }
            placeholder="Question Description"
          />
          <input
            type="text"
            value={question.text}
            onChange={(e) =>
              handleQuestionChange(index, "text", e.target.value)
            }
            placeholder="Coding Prompt"
          />
          <textarea
            value={question.exampleInput}
            onChange={(e) =>
              handleQuestionChange(index, "exampleInput", e.target.value)
            }
            placeholder="Example Input"
          />
          <textarea
            value={question.exampleOutput}
            onChange={(e) =>
              handleQuestionChange(index, "exampleOutput", e.target.value)
            }
            placeholder="Example Output"
          />
          <h4>Test Cases</h4>
          {question.testCases.map((testCase, testCaseIndex) => (
            <div key={testCaseIndex} className="create-test-test-cases-cont">
              <textarea
                value={testCase.input}
                onChange={(e) =>
                  handleTestCaseChange(
                    index,
                    testCaseIndex,
                    "input",
                    e.target.value
                  )
                }
                placeholder="Test Case Input"
              />
              <textarea
                value={testCase.expectedOutput}
                onChange={(e) =>
                  handleTestCaseChange(
                    index,
                    testCaseIndex,
                    "expectedOutput",
                    e.target.value
                  )
                }
                placeholder="Expected Output"
              />
            </div>
          ))}
          <button
            className="create-test-add-test-btn"
            onClick={() => handleAddTestCase(index)}
          >
            Add Test Case
          </button>
        </div>
      ))}
      <button className="create-test-add-qs-btn" onClick={handleAddQuestion}>
        Add Question
      </button>
      <h4>Select Candidates</h4>
      {candidates.length > 0 ? (
        candidates.map((candidate) => (
          <div
            key={candidate.candidateId}
            className="create-test-select-candidates"
          >
            <label>
              <input
                type="checkbox"
                value={candidate.candidateId}
                onChange={handleCandidateChange}
              />
              {candidate.candidateName}
            </label>
          </div>
        ))
      ) : (
        <p>No candidates available</p>
      )}
      <button className="create-test-submit-btn" onClick={handleSubmit}>
        Submit Test
      </button>
    </div>
  );
};

export default CreateTest;
