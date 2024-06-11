const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs"); // Import the fs module for file operations

const updateUserData = async (req, res) => {
  try {
    const { userId } = req.user;
    let updateFields = { ...req.body };
    // console.log(req.user);

    // Check if there is a file uploaded
    if (req.file) {
      // If a file is uploaded, update the profile picture field
      const profilePicturePath = `uploads/${userId}/compressed/${req.file.filename}`;
      // const profilePicturePath = `uploads/${userId}/${req.file.filename}`;
      updateFields.profilePicture = profilePicturePath;
      // updateFields.profilePicture = req.file.path.replace(/^.*[\\\/]/, ""); // Extract only the file name from the path
      // updateFields.profilePicture = req.file.path;

      // Find the user by ID to get the old profile picture path
      const user = await UserModel.findById(userId);

      // If the user has an old profile picture, delete it
      if (user.profilePicture) {
        fs.unlinkSync(user.profilePicture); // Delete the old profile picture file
      }
    }

    if (updateFields.password) {
      // If updating password, hash the new password
      const hashedPassword = await bcrypt.hash(updateFields.password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("updated user data: ", updatedUser.dashboardData);
    res.json(updatedUser.dashboardData);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatedUserData = async (req, res) => {
  try {
    // Fetch the updated user profile data from the database using the user ID
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user profile data to the client
    res.json({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  updateUserData,
  updatedUserData,
};
