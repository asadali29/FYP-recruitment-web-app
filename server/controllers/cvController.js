const CvModel = require("../models/Cv");

async function createCv(req, res) {
  try {
    // Extract CV data from the request body
    const { userId, ...cvData } = req.body;

    // Create a new CV document using the CvModel
    const newCv = await CvModel.create({ ...cvData, userId });

    // Return the newly created CV as JSON response
    res.status(201).json(newCv);
  } catch (error) {
    console.error("Error creating CV:", error);
    res.status(500).json({ error: "Failed to create CV" });
  }
}

const checkCV = async (req, res) => {
  try {
    // Get the user ID from query parameters
    const userId = req.query.userId;

    // Find the CV associated with the user ID
    const userCV = await CvModel.findOne({ userId: userId });

    // Check if the user has a CV
    const hasCV = !!userCV;

    res.json({ hasCV });
  } catch (error) {
    console.error("Error checking CV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// function to fetch CV data by user ID
const getCvByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the CV associated with the user ID
    const userCV = await CvModel.findOne({ userId });

    // If CV is found, send it as JSON response
    if (userCV) {
      res.json(userCV);
    } else {
      // If no CV is found, send a 404 response
      res.status(404).json({ message: "CV not found" });
    }
  } catch (error) {
    console.error("Error fetching CV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createCv,
  checkCV,
  getCvByUserId,
};
