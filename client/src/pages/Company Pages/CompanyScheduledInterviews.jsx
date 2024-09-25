import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns-tz";
import { Link } from "react-router-dom";
// import "./CompanyScheduledInterviews.css";

const CompanyScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState(null);
  const timeZone = "Asia/Karachi";

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        // const response = await axios.get("http://localhost:3001/dashboard", {
        const response = await axios.get("/api/dashboard", {
          headers: { Authorization: token },
        });
        // const companyId = response.data.userId;
        const userId = response.data.userId;
        console.log(userId);
        const interviewResponse = await axios.get(
          // "http://localhost:3001/company-interviews",
          "/api/company-interviews",
          {
            headers: { Authorization: token },
            params: { userId },
          }
        );

        console.log("API response:", interviewResponse.data);

        setInterviews(interviewResponse.data);
      } catch (err) {
        setError("Error fetching scheduled interviews");
      }
    };

    fetchInterviews();
  }, []);

  if (error) {
    return <p className="company-scheduled-interviews-error">{error}</p>;
  }

  return (
    <div className="company-scheduled-interviews">
      <h2>
        <span>Scheduled Interviews</span>
      </h2>
      {interviews.length === 0 ? (
        <p className="company-scheduled-interviews-no-interviews">
          No interviews scheduled yet.
        </p>
      ) : (
        <ul className="company-scheduled-interviews-list">
          {interviews.map((interview) => (
            <li
              key={interview.jobId}
              className="company-scheduled-interviews-item"
            >
              <p>
                <strong>Candidate:</strong> {interview.candidateName}
              </p>
              <p>
                <strong>Job Title:</strong> {interview.jobTitle}
              </p>
              <p>
                <strong>Interview Date:</strong>{" "}
                {format(
                  new Date(interview.interviewDate),
                  "yyyy-MM-dd hh:mm:ss a",
                  { timeZone }
                )}
              </p>
              <p>
                <strong>Status: </strong>
                {interview.interviewStatus}
              </p>

              <Link
                to={`/dashboard/interview/${interview.jobId}/${interview.candidateId}?role=company`}
                className="company-scheduled-interviews-link"
              >
                <button>Start Interview</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyScheduledInterviews;
