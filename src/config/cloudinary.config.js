import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Constants from '../constant.js';

// Use cloudinary.v2 for the latest stable API in version 1.x
const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
    cloud_name: Constants.CLOUD_NAME,
    api_key: Constants.API_KEY,
    api_secret: Constants.API_SECRET
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinaryV2,
//     params: {
//         folder: 'careerhunt',
//         resource_type: 'raw',
//         allowedFormats: ['jpg', 'png', 'jpeg', '.pdf'],
//     }
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async (req, file) => {
    const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Remove .pdf
    if(file.mimetype === 'application/pdf') {
      return {
        folder: 'careerhunt/resumes',
        public_id: originalName,
        resource_type: 'raw',  // Yeh important hai for non-image files
        format: 'pdf',
      };
    } else {
      return {
        folder: 'careerhunt/images',
        resource_type: 'image',  // default for images
        format: 'jpg', // or keep original
      };
    }
  },
});



export { cloudinaryV2 as cloudinary, storage };
