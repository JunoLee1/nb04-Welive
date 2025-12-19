import express from 'express';
import { authRoutes }from './auth/auth.routes.js';
import usersRoutes from './user/user.routes.js'
const router = express.Router();

router.use(authRoutes);
router.use(usersRoutes);

export default router;