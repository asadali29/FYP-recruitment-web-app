import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodingSandbox = ({
  questionId,
  candidateId,
  testId,
  questionTitle,
  questionDesc,
  questionText,
}) => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [isFinal, setIsFinal] = useState(false);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/evaluate-test",
        {
          code,
          questionId,
          candidateId,
          testId,
          isFinal,
          questionTitle,
          questionDesc,
          questionText,
        },
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data);
      setResult(response.data);
    } catch (error) {
      console.error("Error evaluating code:", error);
    }
  };

  const handleFinalChange = async () => {
    // setIsFinal(true);
    // console.log("final", isFinal);
    // console.log("final (before useEffect)", isFinal);

    // useEffect(() => {
    //   console.log("final (after setIsFinal)", isFinal);
    // }, [isFinal]);
    // alert("Your submission is marked as final, no further edits are allowed");

    try {
      const token = localStorage.getItem("token");
      setIsFinal(true);
      // console.log("final", isFinal);
      const response = await axios.post(
        "/api/evaluate-test",
        {
          code,
          questionId,
          candidateId,
          testId,
          isFinal: true,
          questionTitle,
          questionDesc,
          questionText,
        },
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data);
      setResult(response.data);
      alert("Your submission is marked as final, no further edits are allowed");
    } catch (error) {
      console.error("Error evaluating code:", error);
    }
  };

  return (
    <div>
      <Editor
        height="400px"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
      />
      <button onClick={handleSubmit} className="coding-sandbox-submit-button">
        Submit Code
      </button>
      {result && (
        <div className="coding-sandbox-result-container">
          <p className="coding-sandbox-result-text">
            <strong>Result:</strong>{" "}
            {result.isCorrect ? "Correct" : "Incorrect"}
          </p>
          <p className="coding-sandbox-output-label">Output:</p>
          {result.results.map((testCase, index) => (
            <div key={index} className="coding-sandbox-test-case">
              <p className="coding-sandbox-case-title">
                <strong>Test Case {index + 1}</strong>
              </p>
              <div className="coding-sandbox-case-detail">
                <strong>Input:</strong> <pre>{testCase.input}</pre>
              </div>
              <div className="coding-sandbox-case-detail">
                <strong>Expected Output:</strong>{" "}
                <pre>{testCase.expectedOutput}</pre>
              </div>
              <div className="coding-sandbox-case-detail">
                <strong>Actual Output:</strong>{" "}
                <pre>{testCase.actualOutput}</pre>
              </div>
              {testCase.errorOutput && (
                <div className="coding-sandbox-error-output">
                  <p className="coding-sandbox-error-label">
                    <strong>Error:</strong>
                  </p>
                  <pre>{testCase.errorOutput}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleFinalChange}
        className="coding-sandbox-final-submit-button"
      >
        Final Submit
      </button>
    </div>
  );
};

export default CodingSandbox;
