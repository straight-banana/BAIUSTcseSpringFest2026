import { Router } from "express";
import * as aiController from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";

const router = Router();

router.post("/complete", auth, asyncWrapper(aiController.complete));

export default router;
