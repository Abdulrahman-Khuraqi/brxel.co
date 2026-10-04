/* Shared setup for the command-line scripts: environment, database, exit handling. */
import { getDb, getPool } from "../src/server/db/client.js";

try {
  process.loadEnvFile(".env");
} catch {
  // No .env file: the host's environment provides the variables.
}

export { getDb, getPool };

/** Runs a script body, closes the pool, and exits with a useful code. */
export async function run(main) {
  try {
    await main();
    await getPool().end();
  } catch (error) {
    console.error(`\n✖ ${error.message}`);
    if (process.env.DEBUG) console.error(error);
    try {
      await getPool().end();
    } catch {
      // Pool never opened.
    }
    process.exit(1);
  }
}

/** Parses `--key value` and `--flag` arguments. */
export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith("--")) continue;
    const key = part.slice(2);
    const next = argv[index + 1];
    if (next === undefined || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}
