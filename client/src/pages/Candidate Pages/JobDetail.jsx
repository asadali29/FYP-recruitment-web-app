import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import locationIcon from "../../assets/location-svg.svg";
import salaryIcon from "../../assets/money-dollars-svg.svg";
import jobTypeIcon from "../../assets/job-type-svg.svg";

const JobDetail = ({ id }) => {
  const [job, setJob] = useState(null);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch job details by ID
    if (id) {
      const fetchJobDetails = async () => {
        try {
          const response = await axios.get(
            // `http://192.168.1.101:3001/job-details/${id}`
            // `http://localhost:3001/job-details/${id}`
            `/api/job-details/${id}`
          );
          setJob(response.data);
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      };

      fetchJobDetails();
    }
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, [id]);

  const handleApply = async () => {
    try {
      // Send a request to fetch user data from the dashboard endpoint
      const token = localStorage.getItem("token");
      // const response = await axios.get("http://192.168.1.101:3001/dashboard", {
      // const response = await axios.get("http://localhost:3001/dashboard", {
      const response = await axios.get("/api/dashboard", {
        headers: { Authorization: token },
      });
      const userId = response.data.userId;
      // Send a request to check if the user has a CV
      const cvCheckResponse = await axios.get(
        // "http://192.168.1.101:3001/check-cv",
        // "http://localhost:3001/check-cv",
        "/api/check-cv",
        {
          headers: { Authorization: token },
          params: { userId },
        }
      );
      const hasCV = cvCheckResponse.data.hasCV;

      if (hasCV) {
        // If user has a CV, proceed with applying for the job
        await axios.post(
          // "http://192.168.1.101:3001/job-details/apply",
          // "http://localhost:3001/job-details/apply",
          "/api/job-details/apply",
          { id: job._id },
          { headers: { Authorization: token } }
        );
        alert("Application submitted successfully!");
      } else {
        // If user doesn't have a CV, redirect to the CV creation page
        alert("Please create a CV first before applying");
        navigate("/dashboard/create-cv");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error applying for job:", error);
      }
    }
  };

  // Function to format the posted date
  const formatPostedDate = (date) => {
    const postedDate = moment(date);
    const currentDate = moment();
    const difference = currentDate.diff(postedDate, "seconds");

    if (difference < 60) {
      return `Posted ${difference} seconds ago`;
    } else if (difference < 3600) {
      const minutes = Math.floor(difference / 60);
      return `Posted ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (difference < 86400) {
      const hours = Math.floor(difference / 3600);
      return `Posted ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(difference / 86400);
      return `Posted ${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-detail-container">
      <h1>
        <span>{job.title}</span>
      </h1>
      <p>Company: {job.company}</p>
      <div className="job-detail-head">
        <div className="job-detail-head-card">
          <div>
            <span>
              <img src={locationIcon} />
            </span>
            Location
          </div>{" "}
          <div>
            {job.city}, {job.country}
          </div>
        </div>
        <div className="job-detail-head-card">
          <div>
            <span>
              <img src={salaryIcon} />
            </span>
            Salary
          </div>{" "}
          <div>{job.salary}</div>
        </div>
        <div className="job-detail-head-card">
          <div>
            <span>
              <img src={jobTypeIcon} />
            </span>
            Job Type
          </div>{" "}
          <div>{job.jobType}</div>
        </div>
      </div>
      <div className="jobdetail-description-heading-cont">
        <h2 className="jobdetail-description-heading">Job Description</h2>
        <div>{formatPostedDate(job.datePosted)}</div>
      </div>
      {job.applicants.some((applicant) => applicant.userId === userId) && (
        <div className="job-applied-indicator-detail">
          <span>Applied</span>
          <span>&#9989;</span>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: job.description }}></div>
      <button onClick={handleApply} className="jobdetail-apply-now-button">
        Apply Now
      </button>
    </div>
  );
};

export default JobDetail;
