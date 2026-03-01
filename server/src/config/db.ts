import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const connectDb = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL (Supabase) connected successfully");
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
    process.exit(1);
  }
};
