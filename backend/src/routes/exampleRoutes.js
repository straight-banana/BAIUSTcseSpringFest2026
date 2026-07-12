import { Router } from "express";
import * as exampleController from "../controllers/exampleController.js";
import { auth } from "../middleware/auth.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { validate } from "../middleware/validate.js";
import { createExampleSchema } from "../validators/exampleValidator.js";

const router = Router();

router.get("/", auth, asyncWrapper(exampleController.list));
router.post("/", auth, validate(createExampleSchema), asyncWrapper(exampleController.create));

export default router;
