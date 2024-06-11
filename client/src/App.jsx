import { useState } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import { ProfileImageProvider } from "./components/ProfileImageContext";
import CreateCV from "./pages/Candidate Pages/CreateCV";
import JobPostingForm from "./pages/Company Pages/JobPostingForm";
import JobManagement from "./pages/Company Pages/JobManagement";
import JobFeed from "./pages/Candidate Pages/JobFeed";
import JobDetail from "./pages/Candidate Pages/JobDetail";
import JobDetailWrapper from "./components/JobDetailWrapper";
import ApplicantsPage from "./pages/Company Pages/ApplicantsPage";
// import MouseAnimation from "./components/MouseAnimation";

function App() {
  // const [profileImage, setProfileImage] = useState(""); // Define state for profile image

  // const updateProfileImage = (imageUrl) => {
  //   setProfileImage(imageUrl); // Define function to update profile image
  // };

  return (
    <>
      <ProfileImageProvider>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
              </>
            }
          />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* ProtectedRoute for the dashboard */}
          <Route
            path="/dashboard/*"
            element={<ProtectedRoute element={<Dashboard />} />}
          >
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="create-cv" element={<CreateCV />} />
            <Route path="create-job-posts" element={<JobPostingForm />} />
            <Route path="manage-job-posts" element={<JobManagement />} />
            <Route path="job-feed" element={<JobFeed />} />
            <Route path="job-detail/:id" element={<JobDetailWrapper />} />
            <Route path="job/:jobId/applicants" element={<ApplicantsPage />} />
            {/* <Route path="job-detail/:id" element={<JobDetail />} /> */}
            {/* Pass updateProfileImage function to UserProfile */}
            {/* <Route
              path="user-profile"
              element={<UserProfile updateProfileImage={updateProfileImage} />}
            /> */}
          </Route>
          {/* ProtectedRoute for the user profile */}
          {/* <Route
          path="/dashboard/user-profile"
          element={<ProtectedRoute element={<UserProfile />} />}
        /> */}
        </Routes>
      </ProfileImageProvider>
    </>
  );
}

export default App;
