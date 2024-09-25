import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProfileImage } from "../components/ProfileImageContext";
import defaultProfileImg from "../assets/default-profile-picture.jpg";

const DashboardNavbar = ({ profileRole }) => {
  const { profileImage, userName } = useProfileImage(); // Access profile image state from context
  const uppercaseRole = profileRole.toUpperCase();
  return (
    <div className="dashboardnavbar">
      <div className="profilerole">
        <span>&#8220;</span>
        {uppercaseRole}
        <span>&#8221;</span>
      </div>
      <Link to="/dashboard/user-profile" className="innernavcont">
        <div className="profilename">{userName.toUpperCase()}</div>
        <img
          // src={
          //   profileImage
          //     ? `http://192.168.1.101:3001/${profileImage}`
          //     : defaultProfileImg
          // }
          // src={
          //   profileImage
          //     ? `http://localhost:3001/${profileImage}`
          //     : defaultProfileImg
          // }
          src={profileImage ? `/api/${profileImage}` : defaultProfileImg}
          alt="User Profile"
        />
      </Link>
    </div>
  );
};

export default DashboardNavbar;
