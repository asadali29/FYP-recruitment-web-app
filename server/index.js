const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/FypRecruitmentWebApp");
// mongoose.connect(
//   "mongodb+srv://fypwebapp:8yMvYfamP5KKQRaJ@cluster0.anmxtz2.mongodb.net/FypRecruitmentWebApp?retryWrites=true&w=majority"
// );

// Authentication Route (Register/Login)
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
