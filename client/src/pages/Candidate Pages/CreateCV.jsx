import React, { useState } from "react";
import axios from "axios";

const CreateCV = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    jobTitle: "",
    summary: "",
    workExperience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [""],
    languages: [{ language: "", fluency: "" }],
  });

  // Handle form input change
  const handleInputChange = (e, index, nestedField) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData };
    if (nestedField) {
      if (!updatedFormData[name]) {
        updatedFormData[name] = []; // Initialize the array if it doesn't exist
      }
      if (!updatedFormData[name][index]) {
        updatedFormData[name][index] = {}; // Initialize the object if it doesn't exist
      }
      // Check if the fluency field is being stored in an array and correct it
      if (name.startsWith("fluency-")) {
        const langIndex = parseInt(name.split("-")[1]);
        updatedFormData.languages[langIndex].fluency = value;
      } else {
        // Update other nested fields
        updatedFormData[name][index][nestedField] = value;
      }
    } else if (name === "skills") {
      updatedFormData.skills[index] = value;
    } else {
      updatedFormData[name] = value;
    }
    console.log(updatedFormData);
    setFormData(updatedFormData);
  };

  // Handle adding/removing work experience, education, languages, skills fields
  const handleAddField = (fieldName) => {
    const newField =
      fieldName === "workExperience"
        ? {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
          }
        : fieldName === "education"
        ? {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            current: false,
          }
        : fieldName === "languages"
        ? { language: "", fluency: "" }
        : "";

    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: [...prevFormData[fieldName], newField],
    }));
  };

  const handleRemoveField = (fieldName, index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: prevFormData[fieldName].filter((_, idx) => idx !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Fetch the user's ID from the server response
      // const response = await axios.get("http://192.168.1.101:3001/dashboard", {
      // const response = await axios.get("http://localhost:3001/dashboard", {
      const response = await axios.get("/api/dashboard", {
        headers: { Authorization: token },
      });
      const { userId } = response.data;

      // Define formDataWithUserId here
      const formDataWithUserId = { ...formData, userId };

      const createCvResponse = await axios.post(
        // "http://192.168.1.101:3001/create-cv",
        // "http://localhost:3001/create-cv",
        "/api/create-cv",
        formDataWithUserId
      );
      console.log("CV created successfully:", createCvResponse.data);
      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        jobTitle: "",
        summary: "",
        workExperience: [
          {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
        education: [
          {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
          },
        ],
        skills: [""],
        languages: [{ language: "", fluency: "" }],
      });
      // Display success message to the user
      alert("CV created successfully!");
    } catch (error) {
      console.error("Error creating CV:", error);
      // Display error message to the user
      alert("Failed to create CV. Please try again.");
    }
  };

  return (
    <div className="createcv-cont">
      <h2 className="createcv-heading">
        <span>Create CV</span>
      </h2>
      <form onSubmit={handleSubmit} className="createcv-form">
        {/* Basic Information */}
        <div className="createcv-form-group">
          <label htmlFor="firstName" className="createcv-label">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="createcv-input"
            required
          />
        </div>
        <div className="createcv-form-group">
          <label htmlFor="lastName" className="createcv-label">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="createcv-input"
            required
          />
        </div>
        <div className="createcv-form-group">
          <label htmlFor="middleName" className="createcv-label">
            Middle Name:
          </label>
          <input
            type="text"
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            className="createcv-input"
          />
        </div>
        <div className="createcv-form-group">
          <label htmlFor="email" className="createcv-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="createcv-input"
            required
          />
        </div>
        <div className="createcv-form-group">
          <label htmlFor="phone" className="createcv-label">
            Phone:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="createcv-input"
          />
        </div>
        <div className="createcv-form-group">
          <label htmlFor="jobTitle" className="createcv-label">
            Job Title:
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className="createcv-input"
          />
        </div>
        {/* Summary */}
        <div className="createcv-form-group">
          <label htmlFor="summary" className="createcv-label">
            Summary:
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            className="createcv-input"
          />
        </div>
        {/* Work Experience */}
        {formData.workExperience.map((exp, index) => (
          <div key={index} className="createcv-experience-group">
            <h3 className="createcv-experience-heading">Work Experience</h3>
            <div className="createcv-inner-experience-group">
              <div className="createcv-form-group">
                <label htmlFor={`company-${index}`} className="createcv-label">
                  Company:
                </label>
                <input
                  type="text"
                  id={`company-${index}`}
                  name="workExperience"
                  value={exp.company}
                  onChange={(e) => handleInputChange(e, index, "company")}
                  className="createcv-input"
                  required
                />
              </div>
              <div className="createcv-form-group">
                <label htmlFor={`position-${index}`} className="createcv-label">
                  Position:
                </label>
                <input
                  type="text"
                  id={`position-${index}`}
                  name="workExperience"
                  value={exp.position}
                  onChange={(e) => handleInputChange(e, index, "position")}
                  className="createcv-input"
                  required
                />
              </div>
              <div className="createcv-form-group">
                <label
                  htmlFor={`startDate-${index}`}
                  className="createcv-label"
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  name="workExperience"
                  value={exp.startDate}
                  onChange={(e) => handleInputChange(e, index, "startDate")}
                  className="createcv-input datepicker"
                />
              </div>
              <div className="createcv-form-group">
                <label htmlFor={`endDate-${index}`} className="createcv-label">
                  End Date:
                </label>
                <input
                  type="date"
                  id={`endDate-${index}`}
                  name="workExperience"
                  value={exp.endDate}
                  onChange={(e) => handleInputChange(e, index, "endDate")}
                  className="createcv-input datepicker"
                />
              </div>
              <div className="createcv-form-group">
                <label
                  htmlFor={`description-${index}`}
                  className="createcv-label"
                >
                  Description:
                </label>
                <textarea
                  id={`description-${index}`}
                  name="workExperience"
                  value={exp.description}
                  onChange={(e) => handleInputChange(e, index, "description")}
                  className="createcv-input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveField("workExperience", index)}
              className="createcv-add-btn"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("workExperience")}
          className="createcv-add-btn"
        >
          Add More Work Experience
        </button>
        {/* Education */}
        {formData.education.map((edu, index) => (
          <div key={index} className="createcv-education-group">
            <h3 className="createcv-education-heading">Education</h3>
            <div className="createcv-inner-education-group">
              <div className="createcv-form-group">
                <label
                  htmlFor={`institution-${index}`}
                  className="createcv-label"
                >
                  Institution:
                </label>
                <input
                  type="text"
                  id={`institution-${index}`}
                  name="education"
                  value={edu.institution}
                  onChange={(e) => handleInputChange(e, index, "institution")}
                  className="createcv-input"
                  required
                />
              </div>
              <div className="createcv-form-group">
                <label htmlFor={`degree-${index}`} className="createcv-label">
                  Degree:
                </label>
                <input
                  type="text"
                  id={`degree-${index}`}
                  name="education"
                  value={edu.degree}
                  onChange={(e) => handleInputChange(e, index, "degree")}
                  className="createcv-input"
                  required
                />
              </div>
              <div className="createcv-form-group">
                <label
                  htmlFor={`fieldOfStudy-${index}`}
                  className="createcv-label"
                >
                  Field of Study:
                </label>
                <input
                  type="text"
                  id={`fieldOfStudy-${index}`}
                  name="education"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleInputChange(e, index, "fieldOfStudy")}
                  className="createcv-input"
                  required
                />
              </div>
              <div className="createcv-form-group">
                <label
                  htmlFor={`eduStartDate-${index}`}
                  className="createcv-label"
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  id={`eduStartDate-${index}`}
                  name="education"
                  value={edu.startDate}
                  onChange={(e) => handleInputChange(e, index, "startDate")}
                  className="createcv-input datepicker"
                />
              </div>
              <div className="createcv-form-group">
                <label
                  htmlFor={`eduEndDate-${index}`}
                  className="createcv-label"
                >
                  End Date:
                </label>
                <input
                  type="date"
                  id={`eduEndDate-${index}`}
                  name="education"
                  value={edu.endDate}
                  onChange={(e) => handleInputChange(e, index, "endDate")}
                  className="createcv-input datepicker"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveField("education", index)}
              className="createcv-add-btn"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("education")}
          className="createcv-add-btn"
        >
          Add More Education
        </button>
        {/* Skills */}
        {formData.skills.map((skill, index) => (
          <div key={index} className="createcv-skill-group">
            <div className="createcv-form-group createcv-skills-group">
              <label htmlFor={`skill-${index}`} className="createcv-label">
                Skill:
              </label>
              <input
                type="text"
                id={`skill-${index}`}
                name="skills"
                value={skill}
                onChange={(e) => handleInputChange(e, index)}
                className="createcv-input"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveField("skills", index)}
              className="createcv-add-btn"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("skills")}
          className="createcv-add-btn"
        >
          Add More Skills
        </button>
        {/* Language */}
        {formData.languages.map((lang, index) => (
          <div
            key={index}
            className="createcv-form-group createcv-language-group"
          >
            <div className="createcv-inner-language-group">
              <label htmlFor={`language-${index}`} className="createcv-label">
                Language:
              </label>
              <input
                type="text"
                id={`language-${index}`}
                name="languages"
                value={lang.language}
                onChange={(e) => handleInputChange(e, index, "language")}
                className="createcv-input"
                required
              />
              <label
                htmlFor={`fluency-${index}`}
                className="createcv-label createcv-fluency-label"
              >
                Fluency:
              </label>
              <select
                id={`fluency-${index}`}
                name={`fluency-${index}`}
                value={lang.fluency}
                onChange={(e) => handleInputChange(e, index, "fluency")}
                className="createcv-input"
                required
              >
                <option value="" disabled hidden>
                  Select fluency
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Native">Native/Bilingual</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveField("languages", index)}
              className="createcv-add-btn"
            >
              Remove
            </button>
            {/* Log the fluency value */}
            {console.log(formData.languages[index].fluency)}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("languages")}
          className="createcv-add-btn"
        >
          Add More Language
        </button>
        {/* Submit button */}
        <button type="submit" className="createcv-submit-btn">
          Create CV
        </button>
      </form>
    </div>
  );
};

export default CreateCV;
