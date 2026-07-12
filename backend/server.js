import app from "./app.js";
import { env } from "./src/config/env.js";
import { logger } from "./src/utils/logger.js";

app.listen(env.port, () => {
  logger.info(`API listening on http://localhost:${env.port}`);
});
