import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import profileImg from "../assets/react.svg";
import { useProfileImage } from "../components/ProfileImageContext";
import defaultProfileImg from "../assets/default-profile-picture.jpg";

const DashboardNavbar = ({ profileRole }) => {
  // const DashboardNavbar = ({ profileName, profileRole }) => {
  const { profileImage, userName } = useProfileImage(); // Access profile image state from context
  // const DashboardNavbar = ({ profileName, profileRole, profileImage }) => {
  //   const [imageUrl, setImageUrl] = useState(profileImage); // State to hold profile image URL

  // useEffect(() => {
  //   // Update profile image URL in local state when it changes
  //   setImageUrl(profileImage);
  // }, [profileImage]);

  // Convert profileName to uppercase
  // const uppercaseName = userName.toUpperCase();
  // const uppercaseName = profileName.toUpperCase();
  const uppercaseRole = profileRole.toUpperCase();
  return (
    <div className="dashboardnavbar">
      <div className="profilerole">
        <span>&#8220;</span>
        {uppercaseRole}
        <span>&#8221;</span>
      </div>
      {/* <div className="innernavcont"> */}
      <Link to="/dashboard/user-profile" className="innernavcont">
        <div className="profilename">{userName.toUpperCase()}</div>
        {/* <div className="profilename">{uppercaseName}</div> */}
        {/* <img src={profileImg} alt="User Profile" /> */}
        {/* <img src={profileImage || defaultProfileImg} alt="User Profile" /> */}
        <img
          src={
            profileImage
              ? `http://localhost:3001/${profileImage}`
              : defaultProfileImg
          }
          alt="User Profile"
        />
        {/* <img
          src={
            imageUrl ? `http://localhost:3001/${imageUrl}` : defaultProfileImg
          }
          alt="User Profile"
        /> */}
        {/* Use profileImage if available, otherwise use default */}
      </Link>
      {/* </div> */}
    </div>
  );
};

export default DashboardNavbar;
