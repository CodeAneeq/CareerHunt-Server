import express from 'express';
import upload from '../middleware/multer.middleware.js';
import { addCompany, deleteCompany, editCompany, getAllCompany, getCompany } from '../controllers/company-controller.js';
import { authMiddleware, checkRecruiter } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add-company', authMiddleware, checkRecruiter ,upload.single("logo"), addCompany)
router.delete('/del-company/:id', authMiddleware, checkRecruiter , deleteCompany)
router.get('/get-company', authMiddleware, checkRecruiter , getCompany)
router.get('/get-all-company' , getAllCompany)
router.put("/edit-company", authMiddleware, checkRecruiter,upload.single("logo"), editCompany)


export default router