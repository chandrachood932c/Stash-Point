import { Router } from 'express';
import { signup, signin, verify, me, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verify);
router.get('/me', requireAuth, me);
router.post('/logout', logout);
export default router;
