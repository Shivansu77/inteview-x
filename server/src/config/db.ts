import { Pool } from "pg";

export type AuthStorageMode = "auto" | "postgres" | "file";
export type ActiveAuthStorage = "postgres" | "file";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.SUPABASE_DB_URL;

const configuredStorageMode = (process.env.AUTH_STORAGE_MODE || "auto").toLowerCase();
let activeStorageBackend: ActiveAuthStorage = "postgres";

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  : null;

const getResolvedStorageMode = (): AuthStorageMode => {
  if (configuredStorageMode === "file" || configuredStorageMode === "postgres") {
    return configuredStorageMode;
  }

  return "auto";
};

const getMissingConnectionError = () =>
  new Error(
    "Database connection string missing. Set DATABASE_URL, POSTGRES_URL, POSTGRES_URL_NON_POOLING, POSTGRES_PRISMA_URL, or SUPABASE_DB_URL."
  );

const shouldRequirePostgres = (mode: AuthStorageMode): boolean => {
  return mode === "postgres" || process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
};

export const getActiveStorageBackend = (): ActiveAuthStorage => activeStorageBackend;
export const getConfiguredStorageMode = (): AuthStorageMode => getResolvedStorageMode();

export const connectDb = async (): Promise<void> => {
  const mode = getResolvedStorageMode();

  if (mode === "file") {
    activeStorageBackend = "file";
    console.warn("⚠️ AUTH_STORAGE_MODE=file enabled. Using local file-backed auth storage.");
    return;
  }

  if (!connectionString || !pool) {
    if (shouldRequirePostgres(mode)) {
      throw getMissingConnectionError();
    }

    activeStorageBackend = "file";
    console.warn("⚠️ No PostgreSQL connection string found. Falling back to local file-backed auth storage.");
    return;
  }

  try {
    const client = await pool.connect();
    activeStorageBackend = "postgres";
    console.log("✅ PostgreSQL (Supabase) connected successfully");
    client.release();
  } catch (error) {
    if (shouldRequirePostgres(mode)) {
      console.error("❌ PostgreSQL connection error:", error);
      throw error;
    }

    activeStorageBackend = "file";
    const details = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️ PostgreSQL unavailable in local development (${details}). Falling back to local file-backed auth storage.`);
  }
};
