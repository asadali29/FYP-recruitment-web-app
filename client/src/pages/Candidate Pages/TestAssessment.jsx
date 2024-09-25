import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CodingSandbox from "../../components/CodingSandbox";

const TestAssessment = () => {
  const { testId } = useParams();
  const location = useLocation(); // Hook to access location
  const candidateId = location.state?.candidateId;
  const [tests, setTests] = useState([]);
  // const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/candidate-test-details/${candidateId}`,
          {
            headers: { Authorization: token },
            params: { testId: testId },
          }
        );
        console.log("Test Data:", response.data);
        // setTest(response.data);
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };

    fetchTest();
  }, []);

  // const handleFinalChange = () => {
  //   setIsFinal(!isFinal);
  //   alert("Your submission is marked as final, no further edits are allowed");
  // };

  return (
    <div className="test-assessment-container">
      {tests.length > 0 ? (
        tests.map((test) => (
          <div key={test._id} className="test-assessment-section">
            <h2 className="test-assessment-title">
              <span>{test.title}</span>
            </h2>
            <p className="test-assessment-description">{test.description}</p>
            {test.questions && test.questions.length > 0 ? (
              test.questions.map((question, index) => (
                <div
                  key={question._id}
                  className="test-assessment-question-section"
                >
                  <p className="test-assessment-question-title">
                    Q{index + 1}: {question.title}
                  </p>
                  <p className="test-assessment-question-description">
                    {question.description}
                  </p>
                  <p className="test-assessment-coding-prompt">
                    {question.text}
                  </p>
                  <p className="test-assessment-example-input">
                    Example Input: {question.exampleInput}
                  </p>
                  <p className="test-assessment-example-output">
                    Example Output: {question.exampleOutput}
                  </p>
                  <CodingSandbox
                    questionId={question._id}
                    candidateId={candidateId}
                    testId={testId}
                    questionTitle={question.title}
                    questionDesc={question.description}
                    questionText={question.text}
                    // isFinal={isFinal}
                  />
                </div>
              ))
            ) : (
              <p className="test-assessment-no-questions">
                No questions available
              </p>
            )}

            {/* <button
              onClick={handleFinalChange}
              className="coding-sandbox-submit-button"
            >
              Final Submit
            </button> */}
          </div>
        ))
      ) : (
        <p className="test-assessment-loading">Loading Test</p>
      )}
    </div>
  );
};

export default TestAssessment;
