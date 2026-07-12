import express from "express";
import cors from "cors";
import { env } from "./src/config/env.js";
import { requestLogger } from "./src/middleware/logger.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import routes from "./src/routes/index.js";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(requestLogger);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api", routes);

// Must be mounted last — catches errors from asyncWrapper-wrapped routes.
app.use(errorHandler);

export default app;
