import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema, refreshSchema } from "../validators/authValidator.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncWrapper(authController.register));
router.post("/login", validate(loginSchema), asyncWrapper(authController.login));
router.post("/refresh", validate(refreshSchema), asyncWrapper(authController.refresh));

export default router;
