// UserProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import defaultProfilePicture from "../assets/default-profile-picture.jpg";
import editIcon from "../assets/edit_icon.svg";
import { Outlet } from "react-router-dom";
import { useProfileImage } from "../components/ProfileImageContext";

const UserProfile = () => {
  // const { profileImage } = useProfileImage(); // Access profile image state from context
  // const { updateProfileImage } = useProfileImage(); // Access profile image state from context
  // const UserProfile = ({ updateProfileImage }) => {
  // Access profile image and name update functions from context
  const { updateProfileImage, updateUserName } = useProfileImage();
  // Receive updateProfileImage as a prop
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    profilePicture: null,
  });

  // console.log(userData);

  const [editPassword, setEditPassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [file, setFile] = useState(null); // State for storing the uploaded file
  const fileInputRef = useRef(null); // Ref for file input
  // const [profileImage, setProfileImage] = useState(null); // State for profile image
  // const [showFileInput, setShowFileInput] = useState(false); // State to toggle showing the file input

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    axios
      // .get("http://localhost:3001/dashboard", {
      .get("http://localhost:3001/user-profile", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUserData(response.data);
        updateProfileImage(response.data.profilePicture);
        console.log("Profile Picture Path:", response.data.profilePicture);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordFields({
      ...passwordFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleEditPassword = () => {
    setEditPassword(!editPassword);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Get the uploaded file
  };

  // const handleEditIconClick = () => {
  //   setShowFileInput(true); // Show the file input when the edit icon is clicked
  // };

  const handleEditIconClick = () => {
    // Trigger a click event on the file input element
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Update username in localStorage
    localStorage.setItem("name", userData.name);
    try {
      const formData = new FormData(); // FormData object to send data including file

      // Append user data fields to FormData object
      formData.append("name", userData.name);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("role", userData.role);

      // If editing password, append new password field to FormData object
      if (editPassword) {
        formData.append("password", passwordFields.newPassword);
      }

      // If a file is uploaded, append it to FormData object
      if (file) {
        formData.append("profilePicture", file);
        // formData.append("file", file);
      }

      // console.log(formData);

      // // Send FormData object to the backend for saving
      // const response = await axios.put(
      //   "http://localhost:3001/dashboard",
      //   formData,
      //   {
      //     headers: {
      //       Authorization: localStorage.getItem("token"),
      //       "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      //     },
      //   }
      // );
      // console.log(response.data);

      // // Send FormData object to the backend for saving
      // axios.put("http://localhost:3001/dashboard", formData, {
      //   headers: {
      //     Authorization: localStorage.getItem("token"),
      //     "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      //   },
      // });

      // // Send FormData object to the backend for saving
      // await axios.put("http://localhost:3001/user-profile", formData, {
      //   headers: {
      //     Authorization: localStorage.getItem("token"),
      //     "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      //   },
      // });

      // Send FormData object to the backend for saving
      await axios.put("http://localhost:3001/dashboard", formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
        },
      });

      // Fetch updated user data after successful update
      const updatedUserDataResponse = await axios.get(
        "http://localhost:3001/user-profile",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // // Fetch updated user data after successful update
      // const updatedUserDataResponse = await axios.get(
      //   "http://localhost:3001/dashboard",
      //   {
      //     headers: {
      //       Authorization: localStorage.getItem("token"),
      //     },
      //   }
      // );

      // console.log(updatedUserDataResponse.data);

      // Update userData state with the updated user data
      setUserData(updatedUserDataResponse.data);
      // Update profile image in context
      updateProfileImage(updatedUserDataResponse.data.profilePicture);
      updateUserName(updatedUserDataResponse.data.name);
      // localStorage.setItem("name", updatedUserDataResponse.data.name);
      // console.log("work please", profileImage);

      // updateProfileImage(updatedUserDataResponse.data.profilePicture); // Call the updateProfileImage function

      // // Manually construct the updated userData object with the new profile picture URL
      // const updatedUserData = {
      //   ...userData,
      //   profilePicture: `uploads/${file.name}`,
      // };

      // // Update the userData state with the updated user data
      // setUserData(updatedUserData);

      // Update profile picture URL in the Dashboard component state
      // setProfileImage(updatedUserDataResponse.data.profilePicture);

      // Reset the file input field value using the ref
      fileInputRef.current.value = "";

      // // Updating client-side state with the new profile picture path
      // setUserData((userData) => ({
      //   ...userData,
      //   profilePicture: response.data.profilePicture,
      // }));

      // // Updating client-side state with the new profile picture path
      // setUserData((prevUserData) => ({
      //   ...prevUserData,
      //   profilePicture: response.data.profilePicture,
      // }));

      // // Reset the file state to null to clear the file input field
      // setFile(null);

      // const updatedData = {
      //   ...userData,
      //   ...(editPassword && { password: passwordFields.newPassword }),
      // };

      // // Send updated user data to the backend for saving
      // await axios.put("http://localhost:3001/dashboard", updatedData, {
      //   headers: {
      //     Authorization: localStorage.getItem("token"),
      //   },
      // });

      console.log("User data updated successfully");
      setEditPassword(false); // Reset password edit mode after successful update
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="user-profile-cont">
      <div className="user-profile-area">
        <h2 className="user-profile-heading">User Profile</h2>
        {/* Circular profile picture area */}
        <div className="profile-picture-container">
          <img
            src={
              userData.profilePicture
                ? `http://localhost:3001/${userData.profilePicture}`
                : defaultProfilePicture
            } // Use default picture if no profile picture is available
            alt="Profile"
            className="profile-picture"
          />
          <img
            src={editIcon} // Use the edit icon
            alt="Edit"
            className="edit-icon"
            onClick={handleEditIconClick} // Handle click on the edit icon
          />
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the file input
          />
          {/* Show the edit icon only when the file input is not shown */}
          {/* {!showFileInput && (
          <img
            src={editIcon} // Use the edit icon
            alt="Edit"
            className="edit-icon"
            onClick={handleEditIconClick} // Handle click on the edit icon
          />
        )} */}
          {/* Show the file input only when the edit icon is clicked */}
          {/* {showFileInput && (
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        )} */}
          {/* <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        <div
          className="edit-icon"
          onClick={() => fileInputRef.current.click()} // Open file input when edit icon is clicked
          style={{
            backgroundImage: `url(${editIcon})`, // Set edit icon background image
          }}
        ></div> */}
        </div>
        <form onSubmit={handleSubmit}>
          {/* <label>
          Profile Picture:
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        </label>
        <br /> */}
          <label className="userProfileLabel">
            Name:
            <input
              type="text"
              name="name"
              className="userProfileInput"
              value={userData.name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label className="userProfileLabel">
            Username:
            <input
              type="text"
              name="username"
              className="userProfileInput"
              value={userData.username}
              onChange={handleChange}
              readOnly // Make the username field read-only
            />
          </label>
          <br />
          <label className="userProfileLabel">
            Email:
            <input
              type="email"
              name="email"
              className="userProfileInput"
              value={userData.email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label className="userProfileLabel">
            Role:
            <input
              type="text"
              name="role"
              className="userProfileInput"
              value={userData.role}
              onChange={handleChange}
              readOnly // Make the role field read-only
            />
          </label>
          <br />
          <label className="userProfileLabel">
            Password:
            {editPassword ? (
              <>
                <input
                  type="password"
                  name="currentPassword"
                  className="userProfileInput"
                  placeholder="Current Password"
                  value={passwordFields.currentPassword}
                  onChange={handlePasswordChange}
                />
                <br />
                <input
                  type="password"
                  name="newPassword"
                  className="userProfileInput"
                  placeholder="New Password"
                  value={passwordFields.newPassword}
                  onChange={handlePasswordChange}
                />
                <br />
                <input
                  type="password"
                  name="confirmNewPassword"
                  className="userProfileInput"
                  placeholder="Confirm New Password"
                  value={passwordFields.confirmNewPassword}
                  onChange={handlePasswordChange}
                />
              </>
            ) : (
              <>
                <input
                  className="userProfileInput pass"
                  type="password"
                  value="**********"
                  readOnly
                />
                {/* {userData.password} */}
                <button
                  className="userProfilePassEditBtn"
                  type="button"
                  onClick={handleToggleEditPassword}
                >
                  Edit
                </button>
              </>
            )}
          </label>
          <br />
          <button className="userProfileUpdateBtn" type="submit">
            Update Profile
          </button>
        </form>
        {/* Pass updateProfileImage function to the nested routes */}
        <Outlet />
        {/* <Outlet updateProfileImage={updateProfileImage} /> */}
      </div>
    </div>
  );
};

export default UserProfile;
