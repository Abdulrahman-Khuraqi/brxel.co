import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(".env");
} catch {
  // No .env file: the environment (Hostinger panel, CI) provides the variables.
}

export default defineConfig({
  dialect: "mysql",
  schema: "./src/server/db/schema.js",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL || "mysql://user:pass@localhost:3306/brxel" },
  strict: true,
  verbose: true,
});
