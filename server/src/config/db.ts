import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DB_URL;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const connectDb = async (): Promise<void> => {
  if (!connectionString) {
    throw new Error(
      "Database connection string missing. Set DATABASE_URL (or POSTGRES_URL/SUPABASE_DB_URL)."
    );
  }

  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL (Supabase) connected successfully");
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
    throw error;
  }
};
