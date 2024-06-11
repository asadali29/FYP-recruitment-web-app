import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { useProfileImage } from "../components/ProfileImageContext";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  // const [profileName, setProfileName] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [profileDataFetched, setProfileDataFetched] = useState(false);
  const { updateProfileImage, updateUserName, userName } = useProfileImage();
  // const [profileImage, setProfileImage] = useState(""); // New state for profile image
  const token = localStorage.getItem("token");
  // const [userType, setUserType] = useState("");
  const [typeOfUser, setTypeOfUser] = useState("");
  const { userType } = useParams();
  const location = useLocation();

  useEffect(() => {
    // Check if token is available
    if (!token) {
      console.error("Token is missing.");
      return;
    }

    // Fetch dashboard data
    if (location.pathname === "/dashboard") {
      axios
        .get("http://localhost:3001/dashboard", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log("Dashboard data:", response.data);
          setDashboardData(response.data);
          // setUserType(response.data.role);
          localStorage.setItem("userType", response.data.role); // Save user type
          setTypeOfUser(response.data.role);
          localStorage.setItem("name", response.data.name); // Save username
          localStorage.setItem("userId", response.data.userId);
          // const userType = response.data.role;
          // console.log("User Type:", userType);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
        });
    }

    // Fetch  user profile data
    axios
      // .get("http://localhost:3001/dashboard", {
      .get("http://localhost:3001/user-profile", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        // console.log("Dashboard data:", response.data);
        // setDashboardData(response.data);
        updateUserName(response.data.name);
        // setProfileName(response.data.name);
        setProfileRole(response.data.role);
        updateProfileImage(response.data.profilePicture);
        setProfileDataFetched(true); // Set flag to true after fetching data
        // setProfileImage(response.data.profilePicture); // Set profile image URL
        // console.log("image url", response.data.profilePicture);
        // console.log("image new url", profileImage);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [token]);

  // // Callback function to update profile image URL
  // const updateProfileImage = (imageUrl) => {
  //   setProfileImage(imageUrl);
  // };

  // // Render initial content only if the user is on the dashboard route
  // const renderInitialContent = location.pathname === "/dashboard";

  // Render initial content only when necessary
  const renderInitialContent =
    location.pathname === "/dashboard" && !profileDataFetched && !typeOfUser;
  // const renderInitialContent =
  //   location.pathname === "/dashboard" && !profileDataFetched && !userType;

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setTypeOfUser(storedUserType);
    }

    // const storedUsername = localStorage.getItem("name");
    // if (storedUsername) {
    //   setProfileName(storedUsername);
    // }
  }, []);

  // Toggle function to show/hide FAQ answers
  function toggleAnswer(id) {
    // Iterate over all FAQ answers
    for (let i = 1; i <= 4; i++) {
      const answer = document.getElementById("faq-answer-" + i);
      // Close all answers except the clicked one
      if (i !== id) {
        answer.style.display = "none";
      }
    }
    // Toggle display for the clicked answer
    const clickedAnswer = document.getElementById("faq-answer-" + id);
    clickedAnswer.style.display =
      clickedAnswer.style.display === "none" ? "block" : "none";
  }
  // function toggleAnswer(id) {
  //   var answer = document.getElementById("faq-answer-" + id);
  //   answer.style.display = answer.style.display === "none" ? "block" : "none";
  // }

  return (
    <div className="dashboard">
      {/* <DashboardNavbar profileName={profileName} profileRole={profileRole} /> */}
      <DashboardNavbar profileRole={profileRole} />
      {/* <DashboardNavbar profileName={profileName} profileRole={profileRole} /> */}
      {/* <DashboardNavbar
        profileName={profileName}
        profileRole={profileRole}
        profileImage={profileImage} // Pass profile image URL to DashboardNavbar
      /> */}
      <Sidebar userType={typeOfUser} />
      {/* <Sidebar userType={userType} /> */}
      <div className="main-content">
        {/* Render initial content only if no route active */}
        {/* {!userType && <h1>Welcome, {dashboardData.username}!</h1>} */}
        {/* <h1>Welcome, {dashboardData.username}!</h1> */}
        {/* Render initial content only if profile data has not been fetched */}
        {/* {!profileDataFetched && <h1>Welcome, {dashboardData.username}!</h1>} */}
        {/* {renderInitialContent && !profileDataFetched && (
          <h1>Welcome, {dashboardData.username}!</h1>
        )} */}
        {/* {renderInitialContent && <h1>Welcome, {dashboardData.username}!</h1>} */}
        {location.pathname === "/dashboard" && (
          <>
            {profileDataFetched ? (
              <>
                <h2 className="dashboard-heading">
                  Hello, <span>{userName}!</span>
                  {/* Hello, <span>{profileName}!</span> */}
                  {/* Hello, <span>{dashboardData.name}!</span> */}
                </h2>
                <h1 className="dashboard-main-heading">
                  Welcome to Hireeaze - Simplifying Recruitment
                </h1>
                <div className="dashboard-para-cont">
                  <p className="dashboard-para">
                    Welcome to Hireeaze, your one-stop destination for
                    streamlining the recruitment process! Hireeaze is a
                    comprehensive platform designed to simplify the hiring
                    journey for both employers and job seekers. With powerful
                    features such as job postings, resume management, and
                    interview scheduling.
                  </p>
                  <p>
                    Hireeaze empowers recruiters to find top talent efficiently
                    while helping candidates discover exciting career
                    opportunities. Whether you're a hiring manager seeking the
                    perfect candidate or a job seeker searching for your dream
                    job, Hireeaze has the tools and resources to make hiring and
                    job hunting a breeze.
                  </p>
                </div>
                <div className="faq-container">
                  <h2 className="faq-heading">
                    Frequently Asked Questions (FAQ)
                  </h2>
                  <div className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleAnswer(1)}
                    >
                      How can I create an employer account on Hireeaze?
                    </div>
                    <div
                      className="faq-answer"
                      id="faq-answer-1"
                      style={{ display: "block" }}
                    >
                      To create an employer account on Hireeaze, go to the "Sign
                      Up" page, which you can access after logging out from
                      Dashboard. Fill in the required information, and choose
                      'Company' at the end. Once registered, you can log in to
                      your company dashboard to start posting jobs and managing
                      applicants.
                    </div>
                  </div>
                  <div className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleAnswer(2)}
                    >
                      How do I search for jobs on Hireeaze?
                    </div>
                    <div
                      className="faq-answer"
                      id="faq-answer-2"
                      style={{ display: "none" }}
                    >
                      Job seekers can easily search for jobs on Hireeaze by
                      clicking on the "Job Search" button on the homepage. Enter
                      relevant keywords, location, industry, or job title in the
                      search bar, and browse through the list of available job
                      postings.
                    </div>
                  </div>
                  <div className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleAnswer(3)}
                    >
                      Can I upload my resume to Hireeaze?
                    </div>
                    <div
                      className="faq-answer"
                      id="faq-answer-3"
                      style={{ display: "none" }}
                    >
                      No, job seekers can not upload their resumes to Hireeaze,
                      but they can create a CV/resume in Hireeaze to showcase
                      their skills and qualifications to potential employers.
                      Simply log in to your Candidate account, navigate to the
                      "Create CV" section, and fill in the details. It will be
                      added to your profile for employers to view.
                    </div>
                  </div>
                  <div className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleAnswer(4)}
                    >
                      I'm an employer. How can I manage applicants on Hireeaze?
                    </div>
                    <div
                      className="faq-answer"
                      id="faq-answer-4"
                      style={{ display: "none" }}
                    >
                      Employers can easily manage applicants and track their
                      progress through the hiring process on HireE\eaze. Log in
                      to your Company dashboard, navigate to the "Applicants"
                      section of the job posting, and you'll find a list of all
                      applicants who have applied for the position. From there,
                      you can review resumes, schedule interviews, communicate
                      with candidates, and make hiring decisions seamlessly.
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <h1>Loading Dashboard...</h1>
            )}
          </>
        )}
        <Outlet />
        {/* <Outlet updateProfileImage={updateProfileImage} /> */}
        {/* <h1>Welcome, {dashboardData}!</h1> */}
        {/* <h2>{dashboardData.role}</h2> */}
        {/* <h2>Dashboard Component</h2> */}
        {/* <pre>{JSON.stringify(dashboardData, null, 2)}</pre> */}
      </div>
    </div>
  );
}

export default Dashboard;
