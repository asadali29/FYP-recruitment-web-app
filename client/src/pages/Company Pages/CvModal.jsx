import React from "react";

const CvModal = ({ cv, onClose }) => {
  return (
    <div className="cv-modal-overlay">
      <div className="cv-modal-content">
        <button className="cv-modal-close-btn" onClick={onClose}>
          &#10006;
        </button>
        {cv ? (
          <>
            <div className="cv-modal-header">
              <div className="cv-modal-header-info">
                <h2>
                  {cv.firstName} {cv.middleName} {cv.lastName}
                </h2>
                <h3>{cv.jobTitle}</h3>
                <p className="cv-modal-contact">
                  {cv.email} | {cv.phone}
                </p>
                <p className="cv-modal-summary">{cv.summary}</p>
              </div>
            </div>
            <hr />
            <div className="cv-modal-body">
              <div className="cv-modal-left-column">
                <section className="cv-modal-section">
                  <h3>Work Experience</h3>
                  {cv.workExperience.map((work, index) => (
                    <div key={index} className="cv-modal-item">
                      <h4>
                        {work.position} at {work.company}
                      </h4>
                      <p className="cv-modal-dates">
                        {new Date(work.startDate).toLocaleDateString()} -{" "}
                        {new Date(work.endDate).toLocaleDateString()}
                      </p>
                      <p>{work.description}</p>
                    </div>
                  ))}
                </section>

                <section className="cv-modal-section">
                  <h3>Education</h3>
                  {cv.education.map((edu, index) => (
                    <div key={index} className="cv-modal-item">
                      <h4>
                        {edu.degree} in {edu.fieldOfStudy}
                      </h4>
                      <p className="cv-modal-institution">{edu.institution}</p>
                      <p className="cv-modal-dates">
                        {new Date(edu.startDate).toLocaleDateString()} -{" "}
                        {new Date(edu.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </section>
              </div>
              <div className="cv-modal-right-column">
                <section className="cv-modal-section">
                  <h3>Skills</h3>
                  <ul className="cv-modal-skills">
                    {cv.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </section>

                <section className="cv-modal-section">
                  <h3>Languages</h3>
                  {cv.languages.map((language, index) => (
                    <div key={index} className="cv-modal-item">
                      <p>
                        {language.language} - {language.fluency}
                      </p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </>
        ) : (
          <div className="cv-modal-no-cv-message">
            You haven't created a CV yet. Please create it first.
          </div>
        )}
      </div>
    </div>
  );
};

export default CvModal;
