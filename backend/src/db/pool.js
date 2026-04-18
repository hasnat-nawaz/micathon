const { Pool } = require("pg");

function isProbablyLocalPostgresUrl(connectionString) {
  if (!connectionString) return true;
  return /(localhost|127\.0\.0\.1)/i.test(connectionString);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required (e.g. your Neon Postgres URL).");
}

const pool = new Pool({
  connectionString,
  ...(isProbablyLocalPostgresUrl(connectionString)
    ? {}
    : {
        // Neon requires SSL; for most hosted Postgres this is correct.
        // If you need strict verification, include `sslmode=verify-full` + `sslrootcert` in DATABASE_URL
        // and update this to provide a CA bundle.
        ssl: { rejectUnauthorized: false },
      }),
});

module.exports = { pool };
