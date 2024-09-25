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
import ScheduledInterviews from "./pages/Candidate Pages/ScheduledInterviews";
import CompanyScheduledInterviews from "./pages/Company Pages/CompanyScheduledInterviews";
import VideoChat from "./pages/VideoChat";
import CreateTest from "./pages/Company Pages/CreateTest";
import ManageTests from "./pages/Company Pages/ManageTests";
import TestAssessment from "./pages/Candidate Pages/TestAssessment";
import TestList from "./pages/Candidate Pages/TestList";

function App() {
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
            <Route
              path="scheduled-interviews"
              element={<ScheduledInterviews />}
            />
            <Route
              path="company-scheduled-interviews"
              element={<CompanyScheduledInterviews />}
            />
            <Route
              path="interview/:jobId/:candidateId"
              element={<VideoChat />}
            />
            <Route path="create-test" element={<CreateTest />} />
            <Route path="manage-tests" element={<ManageTests />} />
            {/* <Route path="test-assessment" element={<TestAssessment />} /> */}
            <Route path="interview-test-list" element={<TestList />} />
            <Route
              path="test-assessment/:testId"
              element={<TestAssessment />}
            />
          </Route>
        </Routes>
      </ProfileImageProvider>
    </>
  );
}

export default App;
