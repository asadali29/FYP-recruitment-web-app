import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Country, City } from "country-state-city";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
// import ApplicantsList from "./ApplicantsList";
// import styles from "./JobManagement.module.css";

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
    // requirements: "",
  });

  const [countries, setCountries] = useState([]);
  const [citiesInCountry, setCitiesInCountry] = useState([]);
  //   const isMounted = useRef(false);
  //   const editor = useRef(null);
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
    // if (!isMounted.current) {
    //   const editorContainer = document.getElementById("editor");
    const editorContainer = document.getElementById(`editor-${postId}`);
    if (editorContainer) {
      // editor.current = new Quill(editorContainer, {
      editorRefs.current[postId] = new Quill(editorContainer, {
        theme: "snow",
      });
      //   quill.on("text-change", () => {
      //     const editorContent = quill.root.innerHTML;
      //     setEditedJob((prevEditedJob) => ({
      //       ...prevEditedJob,
      //       description: editorContent,
      //     }));
      //   });
      //   editorRefs.current[postId] = quill;
      //   editorRefs.current.on("text-change", (delta, oldDelta, source) => {
      //     if (source === "user") {
      //       const editorContent = editorRefs.current.root.innerHTML;
      //       setEditedJob(editorContent);
      //     }
      //   });
      //   isMounted.current = true;
    }
    // }
  };

  // Destroy Quill editor
  const destroyQuill = (postId) => {
    if (editorRefs.current[postId]) {
      editorRefs.current[postId].root.innerHTML = "";
      editorRefs.current[postId] = null;
      //   editorRefs.current[postId].deleteModule("toolbar");
      //   editorRefs.current[postId].destroy();
      //   delete editorRefs.current[postId];
    }
  };

  //   useEffect(() => {
  //     initializeQuill();
  //   }, []);

  //   useEffect(() => {
  //     initializeQuill();
  //   }, [editedJob]);

  // Call initializeQuill whenever a new job post is selected for editing
  useEffect(() => {
    // initializeQuill();
    if (editJobId !== null) {
      initializeQuill(editJobId);
    }
    return () => {
      destroyQuill(editJobId);
    };
  }, [editJobId]);

  // Initialize Quill editor
  //   useEffect(() => {
  //     // if (!isMounted.current) {
  //     // Ensure that the editor container exists in the DOM
  //     const editorContainer = document.getElementById("editor");
  //     if (editorContainer) {
  //       editor.current = new Quill(editorContainer, {
  //         theme: "snow",
  //       });
  //       // isMounted.current = true;

  //       editor.current.on("text-change", (delta, oldDelta, source) => {
  //         if (source === "user") {
  //           const editorContent = editor.current.root.innerHTML;
  //           //   setJobDescription(editorContent);
  //           //   onChange={(e) =>
  //           //     setEditedJob({ ...editedJob, description: e.target.value })
  //           //   }
  //           //   setEditedJob(editorContent);
  //           //   setEditedJob({ ...editedJob, description: e.target.value });
  //         }
  //       });
  //     }
  //     // if (editor.current) {
  //     //   const quill = editor.current;
  //     //   quill.on("text-change", () => {
  //     //     setEditedJob((prevJob) => ({
  //     //       ...prevJob,
  //     //       description: quill.root.innerHTML,
  //     //     }));
  //     //   });
  //     // }
  //     // }
  //   }, []);

  //   useEffect(() => {
  //     if (!isMounted.current) {
  //       editor.current = new Quill("#editor", {
  //         theme: "snow",
  //       });
  //       isMounted.current = true;
  //     }
  //   }, []);

  // Function to fetch job posts
  const fetchJobPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/job-posts", {
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

  //   useEffect(() => {
  //     // Fetch job postings belonging to the logged-in company user
  //     const fetchJobPosts = async () => {
  //       try {
  //         const token = localStorage.getItem("token");
  //         const response = await axios.get("http://localhost:3001/job-posts", {
  //           headers: {
  //             Authorization: token,
  //           },
  //         });
  //         setJobPosts(response.data);
  //       } catch (error) {
  //         console.error("Error fetching job posts:", error);
  //       }
  //     };

  //     fetchJobPosts();
  //   }, []);

  const handleEditJob = (jobId) => {
    // Set the edit job id
    setEditJobId(jobId);
    // Find the job to edit
    const jobToEdit = jobPosts.find((job) => job._id === jobId);
    // Set the edited job details
    setEditedJob(jobToEdit);
    // useEffect(() => {
    // initializeQuill(jobId);
    // }, [editJobId]);
    // Set Quill editor content
    // if (editor.current) {
    //   editor.current.setContents(jobToEdit.description);
    // }
    // setEditedJob({
    //   ...jobToEdit,
    //   description: jobToEdit.description, // Ensure description is set separately
    // });
  };

  const handleUpdateJob = async () => {
    try {
      // Send updated job data to the backend
      const token = localStorage.getItem("token");
      const updatedDescription = editorRefs.current[editJobId].root.innerHTML;
      console.log("Updated Description:", updatedDescription);
      await axios.put(
        `http://localhost:3001/job-posts/${editJobId}`,
        // editedJob
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
        // requirements: "",
      });
      // Fetch job posts again after update
      await fetchJobPosts();
      //   fetchJobPosts();
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
      await axios.delete(`http://localhost:3001/job-posts/${jobId}`, {
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
                {/* <span>Number of Applicants:</span> */}
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
                  {/* Initialize Quill editor with existing job description */}
                  {/* <div id="editor"></div> */}
                  <label className="jobManagement-label-jobdescription">
                    Job Description :
                  </label>
                  <div
                    id={`editor-${job._id}`}
                    dangerouslySetInnerHTML={{ __html: editedJob.description }}
                  ></div>
                  {/* <div
                    id="editor"
                    dangerouslySetInnerHTML={{ __html: editedJob.description }}
                  ></div> */}
                  {/* <textarea
                    value={editedJob.description}
                    onChange={(e) =>
                      setEditedJob({
                        ...editedJob,
                        description: e.target.value,
                      })
                    }
                  /> */}
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
                  {/* <textarea
                    value={editedJob.requirements}
                    onChange={(e) =>
                      setEditedJob({
                        ...editedJob,
                        requirements: e.target.value,
                      })
                    }
                  /> */}
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
            {/* ApplicantsList component */}
            {/* <ApplicantsList jobId={job._id} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobManagement;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const JobManagement = () => {
//   const [jobPosts, setJobPosts] = useState([]);

//   useEffect(() => {
//     // Fetch job postings belonging to the logged-in company user
//     const fetchJobPosts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:3001/job-posts", {
//           headers: {
//             Authorization: token,
//           },
//         });
//         setJobPosts(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching job posts:", error);
//       }
//     };

//     fetchJobPosts();
//   }, []);

//   const handleEditJob = (jobId) => {
//     // Implement edit job functionality
//     console.log("Edit job with ID:", jobId);
//   };

//   const handleDeleteJob = async (jobId) => {
//     // Implement delete job functionality
//     console.log("Delete job with ID:", jobId);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:3001/job-posts/${jobId}`, {
//         headers: {
//           Authorization: token,
//         },
//       });
//       // Update job posts state after deletion
//       setJobPosts((prevJobPosts) =>
//         prevJobPosts.filter((job) => job._id !== jobId)
//       );
//       console.log("Job deleted successfully");
//     } catch (error) {
//       console.error("Error deleting job:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Job Management</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Date Posted</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {jobPosts.map((job) => (
//             <tr key={job._id}>
//               <td>{job.title}</td>
//               <td>
//                 {new Date(job.datePosted).toLocaleDateString("en-GB", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </td>
//               {/* <td>{job.datePosted}</td> */}
//               <td>
//                 <button onClick={() => handleEditJob(job._id)}>Edit</button>
//                 <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default JobManagement;
