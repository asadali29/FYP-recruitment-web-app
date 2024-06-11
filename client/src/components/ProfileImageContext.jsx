import React, { createContext, useState, useEffect, useContext } from "react";

const ProfileImageContext = createContext();

export const useProfileImage = () => useContext(ProfileImageContext);

export const ProfileImageProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("");

  // Retrieve profile image from local storage on component mount
  useEffect(() => {
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }

    const storedUserName = localStorage.getItem("name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const updateProfileImage = (imageUrl) => {
    setProfileImage(imageUrl);
    // Store profile image URL in local storage
    localStorage.setItem("profileImage", imageUrl);
  };

  const updateUserName = (name) => {
    setUserName(name);
    // Store user name in local storage
    localStorage.setItem("name", name);
  };

  //   const updateProfileImage = (imageUrl) => {
  //     setProfileImage(imageUrl);
  //   };

  return (
    <ProfileImageContext.Provider
      value={{ profileImage, userName, updateProfileImage, updateUserName }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};
