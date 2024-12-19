import "dotenv/config";
import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env" });

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error("Database credentials not found in environment variables");
}

export default {
  schema: "./db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  } : {},
  verbose: true,
  strict: true,
} satisfies Config;
