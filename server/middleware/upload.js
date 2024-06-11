const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.userId;
    const uploadPath = path.join(__dirname, "../uploads", userId);
    // Creates directory if it doesn't exist
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, uploadPath);
    });
    // cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    // const ext = path.extname(file.originalname);
    // const filename = "profile_picture" + ext; // You can customize the filename as needed
    // cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// // Middleware to compress image using sharp
// const compressImage = async (req, res, next) => {
//   if (!req.file) {
//     return next();
//   }

//   const filePath = req.file.path;
//   const compressedFilePath = path.join(
//     __dirname,
//     "../uploads",
//     req.user.userId,
//     "compressed", // Create a compressed folder inside the user's folder
//     req.file.filename
//   );

//   try {
//     await sharp(filePath).toFile(compressedFilePath);
//     req.compressedFilePath = compressedFilePath; // Store the compressed file path in the request object
//     next();
//   } catch (error) {
//     console.error("Error compressing image:", error);
//     next(error);
//   }
// };

const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const userId = req.user.userId;
  const fileName = req.file.filename;
  const userFolderPath = path.join(__dirname, "../uploads", userId);
  const compressedFolderPath = path.join(userFolderPath, "compressed");
  const filePath = req.file.path;
  const compressedFilePath = path.join(compressedFolderPath, fileName);

  try {
    // Create the compressed folder if it doesn't exist
    if (!fs.existsSync(compressedFolderPath)) {
      fs.mkdirSync(compressedFolderPath, { recursive: true });
    }

    // Compress the image
    await sharp(filePath).toFile(compressedFilePath);

    // Delete the original image file
    fs.unlinkSync(filePath);

    // Update the request object with the compressed file path
    req.compressedFilePath = compressedFilePath;

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error("Error compressing image:", error);
    next(error);
  }
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Use original filename
//   },
// });

// const upload = multer({ storage: storage });

module.exports = { upload, compressImage };
// module.exports = upload;
