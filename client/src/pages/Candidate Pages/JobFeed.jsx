import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Country, City } from "country-state-city";
import { Link } from "react-router-dom";
// import JobDetail from "./JobDetail";

const JobFeed = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [filteredJobPosts, setFilteredJobPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [countries, setCountries] = useState([]);
  const [citiesInCountry, setCitiesInCountry] = useState([]);
  const [userId, setUserId] = useState("");
  //   const [selectedJobId, setSelectedJobId] = useState(null);
  //   const [showJobDetail, setShowJobDetail] = useState(false);

  useEffect(() => {
    // Fetch all job posts initially
    fetchJobPosts();
    // Fetch all countries
    const countries = Country.getAllCountries();
    setCountries(countries);
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  //   useEffect(() => {
  //     console.log("selectedJobId:", selectedJobId);
  //   }, [selectedJobId]);

  const fetchJobPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/job-posts", {
        headers: {
          Authorization: token,
        },
      });
      setJobPosts(response.data);
      setFilteredJobPosts(response.data); // Initialize filteredJobPosts with all job posts
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const handleSearch = () => {
    // Filter job posts based on search criteria
    let filteredJobs = jobPosts.filter((job) => {
      const matchTitle = job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchCountry =
        selectedCountry === "" || job.country === selectedCountry;
      const matchCity = selectedCity === "" || job.city === selectedCity;
      const matchJobType =
        selectedJobType === "" || job.jobType === selectedJobType;
      return matchTitle && matchCountry && matchCity && matchJobType;
    });
    setFilteredJobPosts(filteredJobs);
  };

  // Function to format the posted date
  const formatPostedDate = (date) => {
    const postedDate = moment(date);
    const currentDate = moment();
    const difference = currentDate.diff(postedDate, "seconds");

    if (difference < 60) {
      return `Posted ${difference} seconds ago`;
    } else if (difference < 3600) {
      const minutes = Math.floor(difference / 60);
      return `Posted ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (difference < 86400) {
      const hours = Math.floor(difference / 3600);
      return `Posted ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(difference / 86400);
      return `Posted ${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  // Function to parse and render HTML content
  const parseHtmlContent = (content) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, "text/html");
    return htmlDoc.body.innerHTML;
  };

  // Update city options when country changes
  useEffect(() => {
    if (selectedCountry) {
      const cities = City.getCitiesOfCountry(selectedCountry);
      setCitiesInCountry(cities);
    } else {
      setCitiesInCountry([]);
    }
  }, [selectedCountry]);

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedJobType("");
    setFilteredJobPosts(jobPosts); // Reset filtered job posts to all job posts
  };

  //   useEffect(() => {
  //     console.log("use effect id:", selectedJobId);
  //   }, [selectedJobId]);

  //   const handleJobClick = (jobId) => {
  //     console.log("this is job id:", jobId);
  //     setSelectedJobId(jobId);
  //   };

  return (
    <div className="job-feed-container">
      <h2 className="job-feed-title">
        <span>Job Feed</span>
      </h2>
      <div className="job-feed-filter-area">
        <input
          type="text"
          placeholder="Search by job title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="job-feed-search-input"
        />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="job-feed-filter-select"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="job-feed-filter-select"
        >
          <option value="">Select City</option>
          {citiesInCountry.map((city, index) => (
            <option
              key={`${selectedCountry}-${city.name}-${index}`}
              value={city.name}
            >
              {city.name}
            </option>
          ))}
        </select>
        <select
          value={selectedJobType}
          onChange={(e) => setSelectedJobType(e.target.value)}
          className="job-feed-filter-select"
        >
          <option value="">Select Job Type</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Remote">Remote</option>
        </select>
        <button onClick={handleSearch} className="job-feed-filter-button">
          Search
        </button>
        <button
          onClick={handleClearFilters}
          className="job-feed-filter-button second"
        >
          Clear Filters
        </button>
      </div>
      <div className="job-feed-job-list">
        {filteredJobPosts.map((job) => (
          <Link
            to={`/dashboard/job-detail/${job._id}`}
            key={job._id}
            className="job-feed-job-card"
            // onClick={() => handleJobClick(job._id)}
          >
            <h3>{job.title}</h3>
            <p className="job-feed-company">
              Company: Placeholder Company Name
            </p>
            <p className="job-feed-location">
              Location: {job.city}, {job.country}
            </p>
            <p className="job-feed-salary-type">
              <span>{job.salary}</span>
              <span>{job.jobType}</span>
            </p>
            <p
              className="job-feed-description"
              dangerouslySetInnerHTML={{
                __html: parseHtmlContent(
                  job.description.slice(0, 350) + " ..."
                ),
              }}
            ></p>
            <p className="job-feed-date">{formatPostedDate(job.datePosted)}</p>
            {/* {job.applicants.includes(userId) ? ( */}
            {job.applicants.some((applicant) => applicant.userId === userId) ? (
              <div className="job-applied-indicator-feed">
                <span>Applied</span>
                <span>&#9989;</span>
                {/* <img src={greenTickIcon} alt="Green tick" /> */}
              </div>
            ) : null}
          </Link>
          //   </div>
        ))}
      </div>
      {/* Job detail */}
      {/* {selectedJobId && <JobDetail id={selectedJobId} />} */}
    </div>
  );
};

export default JobFeed;
