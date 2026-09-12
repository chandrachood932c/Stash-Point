import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.middleware.js';
import { listFiles, uploadFile, renameFile, shareFile, deleteFile, storageUsage, downloadFile } from '../controllers/file.controller.js';

const router = Router();
const maxBytes = Number(process.env.MAX_FILE_SIZE_MB || 50) * 1024 * 1024;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes } });

router.use(requireAuth);
router.get('/', listFiles);
router.get('/storage', storageUsage);
router.get('/download/:key', downloadFile);
router.post('/', upload.single('file'), uploadFile);
router.patch('/:id', renameFile);
router.patch('/:id/share', shareFile);
router.delete('/:id', deleteFile);
export default router;
