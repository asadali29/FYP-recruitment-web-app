import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CvModal from "./CvModal";
// import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { fromZonedTime, toZonedTime, format } from "date-fns-tz";

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    userId: "",
    date: "",
    time: "",
    status: "",
  });

  const timeZone = "Asia/Karachi"; // Pakistan Standard Time

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          // `http://localhost:3001/job-details/${jobId}`,
          `/api/job-details/${jobId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (Array.isArray(response.data.applicants)) {
          const cvRequests = response.data.applicants.map((applicant) =>
            // axios.get(`http://localhost:3001/cv/${applicant.userId}`, {
            axios.get(`/api/cv/${applicant.userId}`, {
              headers: {
                Authorization: token,
              },
            })
          );

          const cvResponses = await Promise.all(cvRequests);

          const updatedApplicants = response.data.applicants.map(
            (applicant, index) => ({
              ...applicant,
              cv: cvResponses[index].data,
            })
          );

          setApplicants(updatedApplicants);
          setJobDetails(response.data);
        } else {
          setApplicants([]);
        }
      } catch (err) {
        setError("Error fetching applicants");
      }
    };

    fetchApplicants();
  }, [jobId]);

  const toggleSelection = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        // "http://localhost:3001/toggle-selection",
        "/api/toggle-selection",
        { userId, jobId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.userId === userId
            ? { ...applicant, selected: !applicant.selected }
            : applicant
        )
      );
    } catch (err) {
      console.error("Error toggling selection:", err);
    }
  };

  const handleScheduleInterview = async (applicant) => {
    try {
      const token = localStorage.getItem("token");
      // // Ensure the date is a valid string format
      // const interviewDate = new Date(interviewDetails.date).toISOString();

      // Combine date and time into a single Date object
      const interviewDateLocal = new Date(
        `${interviewDetails.date}T${interviewDetails.time}:00`
      );
      // const timeZone = "Asia/Karachi"; // Pakistan Standard Time
      // const interviewDate = zonedTimeToUtc(
      //   interviewDateLocal,
      //   timeZone
      // ).toISOString();
      const interviewDate = fromZonedTime(interviewDateLocal, timeZone);

      // Debugging statement
      console.log("Interview Date:", interviewDate);

      // if (isNaN(interviewDate.getTime())) {
      //   throw new Error("Invalid date");
      // }
      const response = await axios.post(
        // "http://localhost:3001/schedule-interview",
        "/api/schedule-interview",
        {
          userId: applicant.userId,
          jobId,
          interviewDate: interviewDate.toISOString(),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setApplicants((prev) =>
        prev.map((app) =>
          app.userId === applicant.userId
            ? {
                ...app,
                interviewDate: response.data.applicant.interviewDate,
                interviewStatus: response.data.applicant.interviewStatus,
              }
            : app
        )
      );

      setInterviewDetails({ userId: "", date: "", time: "", status: "" });
      // setSelectedApplicant(null); // Clear selectedApplicant after scheduling
    } catch (err) {
      console.error("Error scheduling interview:", err);
    }
  };

  const handleRescheduleInterview = async (applicant) => {
    try {
      const token = localStorage.getItem("token");
      const interviewDateLocal = new Date(
        `${interviewDetails.date}T${interviewDetails.time}:00`
      );
      const interviewDate = fromZonedTime(interviewDateLocal, timeZone);

      console.log("Rescheduled Interview Date:", interviewDate);

      const response = await axios.patch(
        // "http://localhost:3001/reschedule-interview",
        "/api/reschedule-interview",
        {
          userId: applicant.userId,
          jobId,
          newInterviewDate: interviewDate.toISOString(),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setApplicants((prev) =>
        prev.map((app) =>
          app.userId === applicant.userId
            ? {
                ...app,
                interviewDate: response.data.applicant.interviewDate,
                interviewStatus: "Rescheduled",
              }
            : app
        )
      );

      setInterviewDetails({ userId: "", date: "", time: "", status: "" });
      // setSelectedApplicant(null); // Clear selectedApplicant after rescheduling
    } catch (err) {
      console.error("Error rescheduling interview:", err);
    }
  };

  const handleInterviewStatusChange = async (applicant, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        // "http://localhost:3001/update-interview",
        "/api/update-interview",
        {
          userId: applicant.userId,
          jobId,
          interviewStatus: status,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setApplicants((prev) =>
        prev.map(
          (app) =>
            app.userId === applicant.userId
              ? {
                  ...app,
                  interviewStatus: status,
                  interviewDate:
                    // status === "Cancelled" ? null : app.interviewDate,
                    status === "Cancelled"
                      ? null
                      : status === "Completed"
                      ? null
                      : app.interviewDate,
                  completed: status === "Completed",
                }
              : app
          // app.userId === applicant.userId
          //   ? { ...app, interviewStatus: status }
          //   : app
        )
      );
    } catch (err) {
      console.error("Error updating interview status:", err);
    }
  };

  const handleInterviewDetailsChange = (e) => {
    setInterviewDetails({
      ...interviewDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="applicants-page">
      {jobDetails && (
        <div className="applicants-page-job-details">
          <h2>Applicants for Job: {jobDetails.title}</h2>
          <p>Total Applicants: {jobDetails.numberOfApplicants}</p>
          <button
            className="applicants-page-showSelected-btn"
            onClick={() => setShowSelectedOnly(!showSelectedOnly)}
          >
            {showSelectedOnly
              ? "Show All Applicants"
              : "Show Selected Applicants"}
          </button>
          {/* <hr /> */}
        </div>
      )}
      {showSelectedOnly ? (
        <h3 className="applicants-page-selected-heading">
          Selected Applicants:
        </h3>
      ) : (
        <h3 className="applicants-page-selected-heading">All Applicants:</h3>
      )}
      {error ? (
        <p className="applicants-page-error-message">{error}</p>
      ) : (
        <ol className="applicants-page-applicant-list">
          {applicants
            .filter((applicant) =>
              showSelectedOnly ? applicant.selected : true
            )
            .map((applicant) => (
              <li
                key={applicant.userId}
                className="applicants-page-applicant-item"
              >
                {/* <div> */}
                <div className="applicants-page-applicant-info">
                  {/* <span> */}
                  <h3>
                    {applicant.selected && <span>&#9989; </span>}
                    {applicant.cv.firstName} {applicant.cv.lastName}
                  </h3>
                  {/* </span> */}
                  <div>
                    <button
                      className="applicants-page-view-cv-button"
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      View CV
                    </button>
                    <button
                      className="applicants-page-selection-button"
                      onClick={() => toggleSelection(applicant.userId)}
                    >
                      {applicant.selected ? "Deselect" : "Select"}
                    </button>
                    {/* <button
                      className="applicants-page-schedule-interview-button"
                      onClick={() => handleScheduleInterview(applicant)}
                    >
                      Schedule Interview
                    </button>
                    {applicant.interviewStatus === "Scheduled" && (
                      <div>
                        <button
                          className="applicants-page-update-status-button"
                          onClick={() =>
                            handleInterviewStatusChange(applicant, "Completed")
                          }
                        >
                          Mark as Completed
                        </button>
                        <button
                          className="applicants-page-update-status-button"
                          onClick={() =>
                            handleInterviewStatusChange(applicant, "Cancelled")
                          }
                        >
                          Mark as Cancelled
                        </button>
                        <button
                          className="applicants-page-reschedule-interview-button"
                          onClick={() => handleRescheduleInterview(applicant)}
                        >
                          Reschedule
                        </button>
                      </div>
                    )} */}
                  </div>
                  {/* {applicant.completed && (
                    <p className="applicants-page-completed-status">
                      Interview Completed &#10004;
                    </p>
                  )}
                  {applicant.interviewDate && !applicant.completed && (
                    <p>
                      Interview Date:{" "}
                      {format(
                        toZonedTime(
                          new Date(applicant.interviewDate),
                          timeZone
                        ),
                        "yyyy-MM-dd hh:mm:ss a",
                        { timeZone }
                      )}
                    </p>
                  )} */}
                </div>
                {applicant.selected && (
                  <div className="applicants-page-applicant-schedule">
                    <div>
                      <button
                        className="applicants-page-schedule-interview-button"
                        onClick={() => handleScheduleInterview(applicant)}
                      >
                        Schedule Interview
                      </button>
                      {(applicant.interviewStatus === "Scheduled" ||
                        applicant.interviewStatus === "Rescheduled") && (
                        <div className="applicants-page-schedule-inner-btns">
                          <button
                            className="applicants-page-update-status-completed-button"
                            onClick={() =>
                              handleInterviewStatusChange(
                                applicant,
                                "Completed"
                              )
                            }
                          >
                            Mark as Completed
                          </button>
                          <button
                            className="applicants-page-update-status-cancelled-button"
                            onClick={() =>
                              handleInterviewStatusChange(
                                applicant,
                                "Cancelled"
                              )
                            }
                          >
                            Mark as Cancelled
                          </button>
                          <button
                            className="applicants-page-reschedule-interview-button"
                            onClick={() => handleRescheduleInterview(applicant)}
                          >
                            Reschedule
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="applicants-page-scheduled-text">
                      {applicant.completed && (
                        <p className="applicants-page-completed-status">
                          Interview Completed &#10004;
                        </p>
                      )}
                      {applicant.interviewDate && !applicant.completed && (
                        <p>
                          Interview Date:{" "}
                          {format(
                            toZonedTime(
                              new Date(applicant.interviewDate),
                              timeZone
                            ),
                            "yyyy-MM-dd hh:mm:ss a",
                            { timeZone }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
        </ol>
      )}

      {selectedApplicant && (
        <CvModal
          cv={selectedApplicant.cv}
          onClose={() => setSelectedApplicant(null)}
        />
      )}
      <div className="applicants-page-interview-form">
        <h3>Schedule Interview :</h3>
        <div className="applicants-page-inputs">
          <input
            type="date"
            name="date"
            value={interviewDetails.date}
            onChange={handleInterviewDetailsChange}
            required
          />
          <input
            type="time"
            name="time"
            value={interviewDetails.time}
            onChange={handleInterviewDetailsChange}
            required
          />
        </div>
        {/* <button
          onClick={() => handleScheduleInterview(selectedApplicant)}
          disabled={!interviewDetails.date || !interviewDetails.time}
        >
          Schedule
        </button> */}
      </div>
    </div>
  );
};

export default ApplicantsPage;
