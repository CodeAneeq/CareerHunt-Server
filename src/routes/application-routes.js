import express from 'express';
import { authMiddleware, checkRecruiter } from '../middleware/auth.middleware.js';
import { changeStatus, createApplication, getApplications, getApplicationsByUser, getAppliedStatus } from '../controllers/application-controller.js';


const router = express.Router();

router.post('/add-application', authMiddleware, createApplication)
router.get('/get-applications/:id', authMiddleware, checkRecruiter, getApplications)
router.post('/change-status', authMiddleware, checkRecruiter , changeStatus)
router.get('/get-applied-status/:id', authMiddleware, getAppliedStatus)
router.get("/get-application-user", authMiddleware, getApplicationsByUser)


export default router