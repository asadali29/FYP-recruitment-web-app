// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const TestList = () => {
//   const [tests, setTests] = useState([]);

//   useEffect(() => {
//     const fetchTests = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const userResponse = await axios.get("/api/dashboard", {
//           headers: { Authorization: token },
//         });
//         const candidateResponse = userResponse.data.userId;

//         const response = await axios.get(
//           `/api/candidate-test/${candidateResponse}`,
//           {
//             headers: { Authorization: token },
//           }
//         );

//         console.log("Tests Data:", response.data);
//         setTests(response.data);
//       } catch (error) {
//         console.error("Error fetching tests:", error);
//       }
//     };

//     fetchTests();
//   }, []);

//   return (
//     <div>
//       <h2>Available Tests</h2>
//       {tests.length > 0 ? (
//         <ul>
//           {tests.map((test) => (
//             <li key={test._id}>
//               {/* <Link to={`/test-assessment/${test._id}`}>{test.title}</Link> */}
//               <p>
//                 Job Title:{" "}
//                 {test.assignedCandidates.find(
//                   (candidate) => candidate.id === userResponse.data.userId
//                 )?.jobTitle || "Not Assigned"}
//               </p>
//               <Link to={`/test-assessment/${test._id}`}>
//                 <button>Start Test</button>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No tests available</p>
//       )}
//     </div>
//   );
// };

// export default TestList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [userId, setUserId] = useState(null); // State to store user ID

  useEffect(() => {
    const fetchTestsAndUser = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user data
        const userResponse = await axios.get("/api/dashboard", {
          headers: { Authorization: token },
        });
        const currentUserId = userResponse.data.userId;
        setUserId(currentUserId);

        // Fetch tests
        const response = await axios.get(
          `/api/candidate-test/${currentUserId}`,
          {
            headers: { Authorization: token },
          }
        );

        console.log("Tests Data:", response.data);
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests or user data:", error);
      }
    };

    fetchTestsAndUser();
  }, []);

  return (
    <div className="interview-tests-list-container">
      <h2>
        <span>Available Tests</span>
      </h2>
      {tests.length > 0 ? (
        <ul>
          {tests.map((test) => (
            <li key={test._id} className="interview-test-list-items">
              <p>
                Job Title:{" "}
                {test.assignedCandidates.find(
                  (candidate) => candidate.id.toString() === userId
                )?.jobTitle || "Not Assigned"}
              </p>
              <Link
                to={`/dashboard/test-assessment/${test._id}`}
                state={{ candidateId: userId }}
                className="test-link-button"
              >
                <button className="interview-test-list-take-test-btn">
                  Take Test
                </button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tests available</p>
      )}
    </div>
  );
};

export default TestList;
