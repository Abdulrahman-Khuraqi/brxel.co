import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.js";

/**
 * One connection pool per process. In development the module is re-evaluated
 * on every reload, so the pool is parked on globalThis instead of leaking a
 * new one each time.
 */
function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill in the MySQL connection.");
  }
  return mysql.createPool({
    uri: url,
    charset: "utf8mb4_unicode_ci",
    connectionLimit: Number(process.env.DATABASE_POOL_SIZE || 10),
    waitForConnections: true,
    enableKeepAlive: true,
    // Store and read DATETIME as UTC so times are the same whatever the server's zone.
    timezone: "Z",
    dateStrings: false,
  });
}

const globalForDb = globalThis;

export function getPool() {
  if (!globalForDb.__brxelPool) globalForDb.__brxelPool = createPool();
  return globalForDb.__brxelPool;
}

let instance;

/** The Drizzle client. Created lazily so importing this module never needs a database (e.g. during `next build`). */
export function getDb() {
  if (!instance) instance = drizzle(getPool(), { schema, mode: "default" });
  return instance;
}

export { schema };
