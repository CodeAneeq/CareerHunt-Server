import express from 'express';
import {addStudentDetails, getLoggedUser, getUser, getUserById, login, resetPassword, sendOTP, signUp, verifyOTP} from '../controllers/auth-controller.js';
import upload from '../middleware/multer.middleware.js';
import { authMiddleware, checkRecruiter } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/sign-up', upload.single("profileImg"), signUp);
router.post('/login',login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/get-user/:id', getUserById);
router.get('/get-logged-user', getLoggedUser);
router.post('/student-details', authMiddleware, upload.single("resume"), addStudentDetails);
router.get('/get-users', authMiddleware, checkRecruiter, getUser);

export default router