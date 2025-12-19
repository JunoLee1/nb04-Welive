import express from 'express';
import { authRoutes }from './auth/auth.routes.js';

const router = express.Router();

router.use(authRoutes);
//router.use(postRouter);

export default router;