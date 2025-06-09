import express from 'express';
import { authMiddleware, checkRecruiter } from '../middleware/auth.middleware.js';
import { addJob, deleteJob, editJob, filterJobs, getAllJobs, getCategoryJobs, getJobForRecruiter, getSingleJob, searchJob } from '../controllers/job-controller.js';

const router = express.Router();

router.post('/add-job', authMiddleware, checkRecruiter , addJob)
router.delete('/del-job/:id', authMiddleware, checkRecruiter , deleteJob)
router.get('/get-job', authMiddleware, checkRecruiter, getJobForRecruiter);
router.get('/get-all-jobs', getAllJobs);
router.post('/get-filter-jobs', filterJobs)
router.get('/get-category-jobs/:title', getCategoryJobs)
router.get('/get-search-jobs', searchJob)
router.get('/get-single-job/:id', getSingleJob)
router.put('/edit-job', authMiddleware, checkRecruiter,editJob)

export default router