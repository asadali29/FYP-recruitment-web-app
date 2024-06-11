import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Country, City } from "country-state-city";
// import QuillEditor from "../../components/QuillEditor";
import Quill from "quill";
// const Delta = Quill.import("delta");
// import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const quill = new Quill("#editor", {
//   theme: "snow",
// });

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
  // const [countries, setCountries] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState("");
  // const [cities, setCities] = useState([]);
  // const [selectedCity, setSelectedCity] = useState("");

  // const [jobRequirements, setJobRequirements] = useState("");
  // const editorRef = useRef(null);
  const isMounted = useRef(false);
  const editor = useRef(null);
  // const quill = new Quill("#editor", {
  //   theme: "snow",
  // });

  // Fetch all countries
  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountries(countries);
    // setCountry(countries[0]?.isoCode); // Set default country
  }, []);

  // Update city options when country changes
  useEffect(() => {
    if (country) {
      const cities = City.getCitiesOfCountry(country);
      setCitiesInCountry(cities);
      setCity(cities[0]?.name || ""); // Set default city if available
      // setCity(""); // Reset city when country changes
      // setCity(cities[0]?.name); // Set default city
    }
  }, [country]);

  // Initialize Quill editor
  useEffect(() => {
    // const editor = new Quill(editorRef.current, {
    //   theme: "snow",
    // });
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

    //   // return () => {
    //   //   editor.disable();
    //   // };
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send job posting data to the backend
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/create-job-posts",
        {
          title: jobTitle,
          description: jobDescription,
          jobType: jobType,
          salary: salary,
          country: country,
          city: city,
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

  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const headers = {
  //         "X-CSCAPI-KEY": "YOUR_API_KEY_HERE",
  //       };
  //       const response = await axios.get(
  //         "https://api.countrystatecity.in/v1/countries",
  //         { headers }
  //       );
  //       setCountries(response.data);
  //     } catch (error) {
  //       console.error("Error fetching countries:", error);
  //     }
  //   };

  //   fetchCountries();
  // }, []);

  // useEffect(() => {
  //   const fetchCities = async () => {
  //     if (selectedCountry) {
  //       try {
  //         const headers = {
  //           "X-CSCAPI-KEY": "YOUR_API_KEY_HERE",
  //         };
  //         const response = await axios.get(
  //           `https://api.countrystatecity.in/v1/countries/${selectedCountry}/cities`,
  //           { headers }
  //         );
  //         setCities(response.data);
  //       } catch (error) {
  //         console.error("Error fetching cities:", error);
  //       }
  //     }
  //   };

  //   fetchCities();
  // }, [selectedCountry]);

  // // Function to handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Send job posting data to the backend
  //     const response = await axios.post(
  //       "http://localhost:3001/create-job-posts",
  //       {
  //         title: jobTitle,
  //         description: jobDescription,
  //         jobType: jobType,
  //         salary: salary,
  //         country: selectedCountry,
  //         city: selectedCity,
  //         // requirements: jobRequirements,
  //       }
  //     );

  //     // Handle successful job posting
  //     console.log("Job posted successfully:", response.data);
  //     // Clear form fields after successful submission
  //     setJobTitle("");
  //     setJobDescription("");
  //     setJobType("");
  //     setSalary("");
  //     setSelectedCountry("");
  //     setSelectedCity("");
  //     // setJobRequirements("");
  //   } catch (error) {
  //     // Handle error if job posting fails
  //     console.error("Error posting job:", error);
  //   }
  // };

  // UseEffect with MutationObserver
  // useEffect(() => {
  //   const observer = new MutationObserver((mutationsList) => {
  //     for (let mutation of mutationsList) {
  //       if (mutation.type === "childList" && mutation.addedNodes.length) {
  //         // Handle added nodes (e.g., formatting changes)
  //         console.log("Job description changed:", mutation.addedNodes[0]);
  //       }
  //     }
  //   });

  //   observer.observe(document.getElementById("jobDescription"), {
  //     childList: true,
  //   });

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);

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
          {/* <div ref={editorRef} /> */}
          {/* <QuillEditor // Use the QuillEditor component here
            defaultValue={jobDescription}
            onTextChange={setJobDescription}
          /> */}
          {/* <QuillEditor value={jobDescription} onChange={setJobDescription} /> */}
          {/* <ReactQuill
            id="jobDescription"
            value={jobDescription}
            onChange={setJobDescription}
            // modules={JobPostingForm.modules} // Include Quill modules
            // formats={JobPostingForm.formats} // Include Quill formats
            required
          /> */}
          {/* <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          /> */}
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
          {/* <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.iso2}>
                {country.name}
              </option>
            ))}
          </select> */}
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
              {/* {citiesInCountry.map((city) => ( */}
              {citiesInCountry.map((city, index) => (
                // <option key={city.name} value={city.name}>
                // <option key={`${country}-${city.name}`} value={city.name}>
                <option
                  key={`${country}-${city.name}-${index + 1}`}
                  value={city.name}
                >
                  {city.name}
                </option>
              ))}
            </select>
            {/* <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select> */}
          </div>
        )}

        {/* Job Requirements Input */}
        {/* <div className="form-group">
          <label htmlFor="jobRequirements">Job Requirements</label>
          <textarea
            id="jobRequirements"
            value={jobRequirements}
            onChange={(e) => setJobRequirements(e.target.value)}
          />
        </div> */}

        {/* Submit Button */}
        <button type="submit" className="JobPostingSubmitBtn">
          Post Job
        </button>
      </form>
    </div>
  );
};

// Quill modules configuration
// JobPostingForm.modules = {
//   toolbar: [
//     [{ header: "1" }, { header: "2" }, { font: [] }],
//     [{ size: [] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     ["link"],
//     ["clean"],
//   ],
//   clipboard: {
//     matchVisual: false,
//   },
// };

// // Quill formats configuration
// JobPostingForm.formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
// ];

export default JobPostingForm;
