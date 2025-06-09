import multer from "multer";
import { storage } from "../config/cloudinary.config.js";

// const upload = multer({
//     storage,
//     limits: { fileSize: 1024 * 1024 * 2}
// })

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit for example
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // accept file
    } else {
      cb(new Error('Only .jpeg, .jpg, .png and .pdf files are allowed!'), false); // reject file
    }
  }
});


export default upload