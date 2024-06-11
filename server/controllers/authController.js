const UserModel = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Registration logic
  try {
    const { name, username, email, password, role } = req.body;
    // Check if username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already in use" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user with the hashed password
    const users = await UserModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });
    res.json(users);
  } catch (err) {
    res.json(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      // Compare the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      // password === user.password
      if (passwordMatch) {
        // Generate JWT token
        const token = jwt.sign(
          {
            userId: user._id,
            username: user.username,
            role: user.role,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
          },
          jwtSecretKey,
          {}
        );
        // Send the token to the client
        res.json({ token });
        // res.json("Success");
      } else {
        res.status(401).json({ error: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ error: "No record exists" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
};
