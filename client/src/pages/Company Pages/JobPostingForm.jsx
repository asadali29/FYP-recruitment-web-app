import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Country, City } from "country-state-city";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const JobPostingForm = () => {
  // State variables for form fields
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [citiesInCountry, setCitiesInCountry] = useState([]);
  const isMounted = useRef(false);
  const editor = useRef(null);

  // Fetch all countries
  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountries(countries);
  }, []);

  // Update city options when country changes
  useEffect(() => {
    if (country) {
      const cities = City.getCitiesOfCountry(country);
      setCitiesInCountry(cities);
      setCity(cities[0]?.name || ""); // Set default city if available
    }
  }, [country]);

  // Initialize Quill editor
  useEffect(() => {
    if (!isMounted.current) {
      editor.current = new Quill("#editor", {
        theme: "snow",
      });

      // Listen for text-change event and update jobDescription state
      editor.current.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const editorContent = editor.current.root.innerHTML;
          setJobDescription(editorContent);
        }
      });

      isMounted.current = true;
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send job posting data to the backend
      const token = localStorage.getItem("token");
      // const userResponse = await axios.get("http://localhost:3001/dashboard", {
      const userResponse = await axios.get("/api/dashboard", {
        headers: { Authorization: token },
      });
      const userId = userResponse.data.userId;
      const response = await axios.post(
        // "http://localhost:3001/create-job-posts",
        "/api/create-job-posts",
        {
          title: jobTitle,
          description: jobDescription,
          jobType: jobType,
          salary: salary,
          country: country,
          city: city,
          postedBy: userId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Handle successful job posting
      console.log("Job posted successfully:", response.data);
      // Clear form fields after successful submission
      setJobTitle("");
      setJobDescription("");
      setJobType("");
      setSalary("");
      setCountry("");
      setCity("");
    } catch (error) {
      // Handle error if job posting fails
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="job-posting-form-container">
      <h2>
        <span>Create New Job Post</span>
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Job Title Input */}
        <div className="job-post-form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        {/* Job Description Input */}
        <div className="job-post-form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <div id="editor"></div>
        </div>

        {/* Job Type Input */}
        <div className="job-post-form-group">
          <label htmlFor="jobType">Job Type</label>
          <select
            id="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Select Job Type
            </option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Job Salary Input */}
        <div className="job-post-form-group">
          <label htmlFor="salary">Salary</label>
          <input
            type="text"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>

        {/* Job Country Input */}
        <div className="job-post-form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Job City Input */}
        {country && (
          <div className="job-post-form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              {console.log(citiesInCountry)}{" "}
              {/* Log the citiesInCountry array */}
              {citiesInCountry.map((city, index) => (
                <option
                  key={`${country}-${city.name}-${index + 1}`}
                  value={city.name}
                >
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="JobPostingSubmitBtn">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobPostingForm;
