import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Country, City } from "country-state-city";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Link } from "react-router-dom";

const JobManagement = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [editJobId, setEditJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({
    title: "",
    description: "",
    jobType: "",
    salary: "",
    country: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [citiesInCountry, setCitiesInCountry] = useState([]);
  const editorRefs = useRef({});

  // Fetch all countries
  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountries(countries);
  }, []);

  // Update city options when country changes
  useEffect(() => {
    if (editedJob.country) {
      const cities = City.getCitiesOfCountry(editedJob.country);
      setCitiesInCountry(cities);
    }
  }, [editedJob.country]);

  // Initialize Quill editor
  const initializeQuill = (postId) => {
    const editorContainer = document.getElementById(`editor-${postId}`);
    if (editorContainer) {
      editorRefs.current[postId] = new Quill(editorContainer, {
        theme: "snow",
      });
    }
  };

  // Destroy Quill editor
  const destroyQuill = (postId) => {
    if (editorRefs.current[postId]) {
      editorRefs.current[postId].root.innerHTML = "";
      editorRefs.current[postId] = null;
    }
  };

  // Call initializeQuill whenever a new job post is selected for editing
  useEffect(() => {
    if (editJobId !== null) {
      initializeQuill(editJobId);
    }
    return () => {
      destroyQuill(editJobId);
    };
  }, [editJobId]);

  // Function to fetch job posts
  const fetchJobPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      // const response = await axios.get("http://localhost:3001/job-posts", {
      const response = await axios.get("/api/job-posts", {
        headers: {
          Authorization: token,
        },
      });
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const handleEditJob = (jobId) => {
    // Set the edit job id
    setEditJobId(jobId);
    // Find the job to edit
    const jobToEdit = jobPosts.find((job) => job._id === jobId);
    // Set the edited job details
    setEditedJob(jobToEdit);
  };

  const handleUpdateJob = async () => {
    try {
      // Send updated job data to the backend
      const token = localStorage.getItem("token");
      const updatedDescription = editorRefs.current[editJobId].root.innerHTML;
      console.log("Updated Description:", updatedDescription);
      await axios.put(
        // `http://localhost:3001/job-posts/${editJobId}`,
        `/api/job-posts/${editJobId}`,
        {
          ...editedJob,
          description: updatedDescription,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // Clear edit state
      setEditJobId(null);
      setEditedJob({
        title: "",
        description: "",
        jobType: "",
        salary: "",
        country: "",
        city: "",
      });
      // Fetch job posts again after update
      await fetchJobPosts();
      console.log("Job updated successfully");
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    // Implement delete job functionality
    console.log("Delete job with ID:", jobId);
    try {
      const token = localStorage.getItem("token");
      // await axios.delete(`http://localhost:3001/job-posts/${jobId}`, {
      await axios.delete(`/api/job-posts/${jobId}`, {
        headers: {
          Authorization: token,
        },
      });
      // Update job posts state after deletion
      setJobPosts((prevJobPosts) =>
        prevJobPosts.filter((job) => job._id !== jobId)
      );
      console.log("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="jobManagement-cont">
      <h2>
        <span>Job Management</span>
      </h2>
      <div className="jobManagement-jobList">
        {jobPosts.map((job, index) => (
          <div key={job._id} className="jobManagement-jobItem">
            <div className="jobManagement-jobDetails">
              <h3>
                <span>{`${index + 1})`}</span>
                {job.title}
              </h3>
              <p className="date-posted">
                <strong>Date Posted: </strong>
                {new Date(job.datePosted).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="Applicants-no">
                <Link to={`/dashboard/job/${job._id}/applicants`}>
                  <span>Number of Applicants:</span>
                  {job.numberOfApplicants}
                </Link>
              </p>
              {editJobId === job._id && (
                <div className="jobManagement-editForm">
                  <label>Title :</label>
                  <input
                    type="text"
                    value={editedJob.title}
                    onChange={(e) =>
                      setEditedJob({ ...editedJob, title: e.target.value })
                    }
                  />
                  <label className="jobManagement-label-jobdescription">
                    Job Description :
                  </label>
                  <div
                    id={`editor-${job._id}`}
                    dangerouslySetInnerHTML={{ __html: editedJob.description }}
                  ></div>
                  <label className="jobManagement-label-jobtype">
                    Job Type :
                  </label>
                  <input
                    type="text"
                    className="jobManagement-edit-jobtype"
                    value={editedJob.jobType}
                    onChange={(e) =>
                      setEditedJob({ ...editedJob, jobType: e.target.value })
                    }
                  />
                  <label>Salary :</label>
                  <input
                    type="text"
                    value={editedJob.salary}
                    onChange={(e) =>
                      setEditedJob({ ...editedJob, salary: e.target.value })
                    }
                  />
                  <label>Country :</label>
                  <select
                    value={editedJob.country}
                    onChange={(e) =>
                      setEditedJob({ ...editedJob, country: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <label>City :</label>
                  {editedJob.country && (
                    <select
                      value={editedJob.city}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, city: e.target.value })
                      }
                      required
                    >
                      <option value="">Select City</option>
                      {citiesInCountry.map((city, index) => (
                        <option
                          key={`${editedJob.country}-${city.name}-${index + 1}`}
                          value={city.name}
                        >
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    className="jobManagement-updatebtn"
                    onClick={handleUpdateJob}
                  >
                    Update Job
                  </button>
                </div>
              )}
            </div>
            <div className="jobManagement-actions">
              <button onClick={() => handleEditJob(job._id)}>Edit</button>
              <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobManagement;
