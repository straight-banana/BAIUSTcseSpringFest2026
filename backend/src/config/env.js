import "dotenv/config";

// Reads and validates process.env once, at startup, so a missing var fails
// fast instead of surfacing as a confusing error three layers deep.
const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key} (see backend/.env.example)`);
  }
}

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  ai: {
    customUrl: process.env.CUSTOM_AI_API_URL,
    customKey: process.env.CUSTOM_AI_API_KEY,
    opensourceUrl: process.env.OPENSOURCE_AI_API_URL,
    opensourceKey: process.env.OPENSOURCE_AI_API_KEY,
  },
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
