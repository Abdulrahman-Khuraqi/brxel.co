/*
 * Applies pending migrations from /drizzle. Safe to run on every deploy:
 * applied migrations are recorded in __drizzle_migrations and skipped.
 */
import { migrate } from "drizzle-orm/mysql2/migrator";
import { getDb, getPool, run } from "./lib.js";

run(async () => {
  const pool = getPool();
  const [[{ name }]] = await pool.query("SELECT DATABASE() AS name");
  if (!name) throw new Error("DATABASE_URL has no database name.");

  // Arabic text needs utf8mb4; make it the default for every table the migrations create.
  try {
    await pool.query(`ALTER DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } catch (error) {
    console.warn(`! Could not set the database charset (${error.code}). Make sure "${name}" uses utf8mb4.`);
  }

  await migrate(getDb(), { migrationsFolder: "./drizzle" });
  console.log(`✔ Database "${name}" is up to date.`);
});
