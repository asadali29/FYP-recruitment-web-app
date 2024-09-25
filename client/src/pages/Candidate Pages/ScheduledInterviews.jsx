import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns-tz";
import { Link } from "react-router-dom";

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState(null);
  const timeZone = "Asia/Karachi";

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        // const response = await axios.get(
        //   "http://192.168.1.101:3001/dashboard",
        //   {
        // const response = await axios.get("http://localhost:3001/dashboard", {
        const response = await axios.get("/api/dashboard", {
          headers: { Authorization: token },
        });
        const userId = response.data.userId;
        const interviewsResponse = await axios.get(
          // "http://192.168.1.101:3001/candidate-interviews",
          // "http://localhost:3001/candidate-interviews",
          "/api/candidate-interviews",
          {
            headers: { Authorization: token },
            params: { userId },
          }
        );

        console.log("API response:", interviewsResponse.data);

        setInterviews(interviewsResponse.data);
      } catch (err) {
        setError("Error fetching scheduled interviews");
      }
    };

    fetchInterviews();
  }, []);

  if (error) {
    // return <p>{error}</p>;
    return <p className="scheduled-interviews-error">{error}</p>;
  }

  return (
    <div className="scheduled-interviews">
      <h2>
        <span>Scheduled Interviews</span>
      </h2>
      {interviews.length === 0 ? (
        <p className="scheduled-interviews-no-interviews">
          No interviews scheduled yet.
        </p>
      ) : (
        <ul className="scheduled-interviews-interview-list">
          {interviews.map((interview) => (
            <li
              key={interview.jobId}
              className="scheduled-interviews-interview-item"
            >
              <Link
                to={`/dashboard/job-detail/${interview.jobId}`}
                className="scheduled-interviews-job-link"
              >
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
              </Link>
              <Link
                to={`/dashboard/interview/${interview.jobId}/${interview.candidateId}?role=candidate`}
                className="scheduled-interviews-job-link"
              >
                <button>Join Interview</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledInterviews;
