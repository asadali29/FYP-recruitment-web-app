const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // store the file path
  },
  dashboardData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
