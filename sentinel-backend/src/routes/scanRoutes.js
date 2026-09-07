import express from 'express';
import multer from 'multer';
import { processEmailUpload, getAllCases, getCaseById, chatWithSentinel } from '../controllers/scanController.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('emlFile'), processEmailUpload);
router.get('/cases', getAllCases);
router.get('/cases/:id', getCaseById);

// NEW: Route for the floating AI assistant
router.post('/chat', chatWithSentinel);

export default router;