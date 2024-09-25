import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const ManageTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/tests", {
          headers: { Authorization: token },
        });
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  const handleDelete = async (testId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/tests/${testId}`, {
        headers: { Authorization: token },
      });
      setTests(tests.filter((test) => test._id !== testId));
      alert("Test deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleGenerateReport = async (candidateId, testId, candidateName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/generate-report/${candidateId}/${testId}`,
        {
          headers: { Authorization: token },
        }
      );

      const reportData = response.data;
      console.log("report data: ", reportData);
      const doc = new jsPDF();

      // Set font, size, and margin
      const margin = 20;
      let yPos = margin;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`Report for Test: ${reportData.testTitle}`, margin, yPos);

      yPos += 10;
      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");
      doc.text(`Candidate Name: ${candidateName}`, margin, yPos);
      yPos += 8;
      doc.text(`Test Date: ${reportData.createdAt}`, margin, yPos);

      yPos += 10;
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text("Answers:", margin, yPos);

      // Draw a line separator
      yPos += 5;
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, 200, yPos);

      yPos += 10;
      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");

      reportData.answers.forEach((answer, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(`Q${index + 1}: ${answer.questionTitle}`, margin, yPos);
        yPos += 8;

        doc.setFont("Helvetica", "italic");
        doc.text(`Code Submitted:`, margin + 5, yPos);

        doc.setFont("Helvetica", "normal");
        const codeLines = doc.splitTextToSize(answer.submittedCode, 160); // Split text into multiple lines
        codeLines.forEach((line) => {
          yPos += 8;
          doc.text(line, margin + 10, yPos);
        });

        yPos += 10;
      });

      doc.save(`${candidateName}_Report_${reportData.testTitle}.pdf`);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="manage-tests-container">
      <h2>
        <span>Manage Tests</span>
      </h2>
      <ul className="manage-tests-lists">
        {tests.map((test) => (
          <li key={test._id} className="manage-tests-items">
            <h3>{test.title}</h3>
            {/* <p>{test.description}</p> */}
            <p>Number of Questions: {test.questions.length}</p>
            {/* <p></p> */}
            {test.assignedCandidates.length > 0 ? (
              <ul>
                {test.assignedCandidates.map((candidate) => (
                  <li key={candidate.id}>
                    <p>Candidate Name: {candidate.name}</p>
                    <p>Job Title: {candidate.jobTitle}</p>
                    <div>
                      <button
                        onClick={() =>
                          handleGenerateReport(
                            candidate.id,
                            test._id,
                            candidate.name
                          )
                        }
                        className="generate-report-button"
                      >
                        Generate Report
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No candidates assigned</p>
            )}
            <button
              className="manage-tests-del-btn"
              onClick={() => handleDelete(test._id)}
            >
              Delete Test
            </button>
            {/* <div>
              <button
                onClick={() =>
                  handleGenerateReport(test.assignedCandidates.id, test._id)
                }
                className="generate-report-button"
              >
                Generate Report
              </button>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTests;
