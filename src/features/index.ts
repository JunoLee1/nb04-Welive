import express from 'express';
import authRoutes from './auth/auth.routes.js';
import usersRoutes from './user/user.routes.js'
import aptRouter from './apartment/apartments.routes.js';
const router = express.Router();

router.use("/auth", authRoutes);
console.log("⚓️:received requset from clients:");
router.use("/users", usersRoutes);
router.use("/apartments",aptRouter)

export default router;