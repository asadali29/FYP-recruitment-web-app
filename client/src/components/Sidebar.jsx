// Sidebar.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoutIcon from "../assets/logout_icon.svg";
import axios from "axios";
import CvModal from "../pages/Company Pages/CvModal";

const Sidebar = ({ userType }) => {
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvData, setCvData] = useState(null);
  console.log("User Type:", userType);
  const navigate = useNavigate();

  const handleViewCv = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/dashboard", {
        headers: { Authorization: token },
      });
      const userId = response.data.userId;

      // const cvCheckResponse = await axios.get(
      //   "http://localhost:3001/check-cv",
      //   {
      //     headers: { Authorization: token },
      //     params: { userId },
      //   }
      // );

      // if (cvCheckResponse.data.hasCV) {
      // If the candidate has a CV, fetch and set the CV data
      const cvResponse = await axios.get(`http://localhost:3001/cv/${userId}`, {
        headers: { Authorization: token },
      });
      setCvData(cvResponse.data);
      setShowCvModal(true);
      // }
      // } else {
      //   // If the candidate doesn't have a CV, display a message
      //   alert("You haven't created a CV yet.");
      //   // Alternatively, you can redirect the candidate to the create CV page
      //   // navigate("/dashboard/create-cv");
      // }
    } catch (error) {
      console.error("Error viewing CV:", error);
      setShowCvModal(true);
    }
  };

  const handleCloseCvModal = () => {
    console.log("Closing CV modal");
    setShowCvModal(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    // Redirect to the login page
    navigate("/login");
  };
  return (
    <div className="sidebar">
      {/* <h2> */}
      <Link to="/dashboard" className="sidebarDashboardLink">
        Dashboard
      </Link>
      {/* </h2> */}
      <ul className="sidebarLinksArea">
        {/* <CommonLinks handleLogout={handleLogout} /> */}
        {userType === "Candidate" && (
          <CandidateLinks
            handleViewCv={handleViewCv}
            // cvData={cvData}
            // handleCloseCvModal={handleCloseCvModal}
          />
        )}
        {userType === "Company" && <CompanyLinks />}
        <CommonLinks handleLogout={handleLogout} />
      </ul>
      {/* <CvModal cv={cvData} onClose={handleCloseCvModal} /> */}
      {showCvModal && <CvModal cv={cvData} onClose={handleCloseCvModal} />}
    </div>
  );
};

const CommonLinks = ({ handleLogout }) => (
  <>
    <Link
      to="/dashboard/logout"
      className="sidebarLink logout-link"
      onClick={handleLogout}
    >
      Logout
      <img src={logoutIcon} alt="logout" className="logout-icon" />
    </Link>
    {/* <Link to="/common/link1">Common Link 1</Link>
    <Link to="/common/link2">Common Link 2</Link> */}
  </>
);

// const CandidateLinks = ({ handleViewCv, cvData, handleCloseCvModal }) => (
const CandidateLinks = ({ handleViewCv }) => (
  <>
    <Link to="/dashboard/create-cv" className="sidebarLink">
      Create CV &#10170;
    </Link>
    <Link to="#" className="sidebarLink" onClick={handleViewCv}>
      View CV &#10170;
    </Link>
    <Link to="/dashboard/job-feed" className="sidebarLink">
      Job Feed &#10170;
    </Link>

    {/* <CvModal cv={cvData} onClose={handleCloseCvModal} /> */}
  </>
);

const CompanyLinks = () => (
  <>
    <Link to="/dashboard/create-job-posts" className="sidebarLink">
      Create Job &#10170;
    </Link>
    <Link to="/dashboard/manage-job-posts" className="sidebarLink">
      Manage Jobs &#10170;
    </Link>
  </>
);

export default Sidebar;
