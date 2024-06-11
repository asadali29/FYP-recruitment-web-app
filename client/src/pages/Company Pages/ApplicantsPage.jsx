import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CvModal from "./CvModal";

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3001/job-details/${jobId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (Array.isArray(response.data.applicants)) {
          const cvRequests = response.data.applicants.map((applicant) =>
            axios.get(`http://localhost:3001/cv/${applicant.userId}`, {
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
        "http://localhost:3001/toggle-selection",
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
                  </div>
                </div>
                {/* <div>
                  <button
                    className="applicants-page-selection-button"
                    onClick={() => toggleSelection(applicant.userId)}
                  >
                    {applicant.selected ? "Deselect" : "Select"}
                  </button>
                </div> */}
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
    </div>
  );
};

export default ApplicantsPage;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import CvModal from "./CvModal";
// // import "./ApplicantsPage.css";

// const ApplicantsPage = () => {
//   const { jobId } = useParams();
//   const [jobDetails, setJobDetails] = useState(null);
//   const [applicants, setApplicants] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedApplicant, setSelectedApplicant] = useState(null);

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:3001/job-details/${jobId}`,
//           {
//             headers: {
//               Authorization: token,
//             },
//           }
//         );
//         console.log("API Response:", response.data);

//         if (Array.isArray(response.data.applicants)) {
//           setApplicants(response.data.applicants);
//           setJobDetails(response.data);

//           // Fetch CVs for each applicant
//           const cvRequests = response.data.applicants.map((applicant) =>
//             axios.get(`http://localhost:3001/cv/${applicant.userId}`, {
//               headers: {
//                 Authorization: token,
//               },
//             })
//           );

//           // Wait for all CV requests to complete
//           const cvResponses = await Promise.all(cvRequests);

//           // Map CV data to applicants
//           const updatedApplicants = response.data.applicants.map(
//             (applicant, index) => ({
//               ...applicant,
//               cv: cvResponses[index].data, // Assuming CV data is returned in the response
//             })
//           );

//           setApplicants(updatedApplicants);
//         } else {
//           console.error(
//             "API response does not contain an applicants array:",
//             response.data
//           );
//           setApplicants([]);
//         }
//       } catch (err) {
//         console.error("Error fetching applicants:", err);
//         setError("Error fetching applicants");
//       }
//     };

//     fetchApplicants();
//   }, [jobId]);

//   return (
//     <div className="applicants-page">
//       {jobDetails && (
//         <div className="applicants-page-job-details">
//           <h2>Applicants for Job: {jobDetails.title}</h2>
//           <p>Total Applicants: {jobDetails.numberOfApplicants}</p>
//           <hr />
//         </div>
//       )}
//       {error ? (
//         <p className="applicants-page-error-message">{error}</p>
//       ) : (
//         <ol className="applicants-page-applicant-list">
//           {applicants.map((applicant) => (
//             <li key={applicant._id} className="applicants-page-applicant-item">
//               <div className="applicants-page-applicant-info">
//                 <h3>{applicant.name}</h3>
//                 <button
//                   className="applicants-page-view-cv-button"
//                   onClick={() => setSelectedApplicant(applicant)}
//                 >
//                   View CV
//                 </button>
//               </div>
//               {selectedApplicant && selectedApplicant._id === applicant._id && (
//                 <CvModal
//                   cv={applicant.cv}
//                   onClose={() => setSelectedApplicant(null)}
//                 />
//               )}
//             </li>
//           ))}
//         </ol>
//       )}
//     </div>
//   );
// };

// export default ApplicantsPage;
