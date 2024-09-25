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
      // const response = await axios.get("http://192.168.1.101:3001/dashboard", {
      // const response = await axios.get("http://localhost:3001/dashboard", {
      const response = await axios.get("/api/dashboard", {
        headers: { Authorization: token },
      });
      const userId = response.data.userId;

      // If the candidate has a CV, fetch and set the CV data
      // const cvResponse = await axios.get(
      //   `http://192.168.1.101:3001/cv/${userId}`,
      //   {
      // const cvResponse = await axios.get(`http://localhost:3001/cv/${userId}`, {
      const cvResponse = await axios.get(`/api/cv/${userId}`, {
        headers: { Authorization: token },
      });
      setCvData(cvResponse.data);
      setShowCvModal(true);
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
      <Link to="/dashboard" className="sidebarDashboardLink">
        Dashboard
      </Link>
      <ul className="sidebarLinksArea">
        {userType === "Candidate" && (
          <CandidateLinks handleViewCv={handleViewCv} />
        )}
        {userType === "Company" && <CompanyLinks />}
        <CommonLinks handleLogout={handleLogout} />
      </ul>
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
  </>
);

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
    <Link to="/dashboard/scheduled-interviews" className="sidebarLink">
      Interviews &#10170;
    </Link>
    {/* <Link to="/dashboard/test-assessment" className="sidebarLink">
      Interview Tests &#10170;
    </Link> */}
    <Link to="/dashboard/interview-test-list" className="sidebarLink">
      Interview Tests &#10170;
    </Link>
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
    <Link to="/dashboard/company-scheduled-interviews" className="sidebarLink">
      Scheduled Interviews &#10170;
    </Link>
    <Link to="/dashboard/create-test" className="sidebarLink">
      Create Tests &#10170;
    </Link>
    <Link to="/dashboard/manage-tests" className="sidebarLink">
      Manage Tests &#10170;
    </Link>
  </>
);

export default Sidebar;
