import { Router } from "express";
import authRoutes from "./authRoutes.js";
import exampleRoutes from "./exampleRoutes.js";
import aiRoutes from "./aiRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/examples", exampleRoutes);
router.use("/ai", aiRoutes);

export default router;
