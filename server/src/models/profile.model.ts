import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getActiveStorageBackend, pool } from "../config/db";

export interface IProfile {
  id: string;
  user_id: string;
  headline: string;
  targetRole: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeFileName: string;
  updated_at: Date | string;
}

const FILE_STORE_PATH = path.resolve(process.cwd(), ".data", "profiles.json");

const isPostgresStorage = (): boolean => getActiveStorageBackend() === "postgres";

const getPool = () => {
  if (!pool) throw new Error("PostgreSQL pool is not configured.");
  return pool;
};

const ensureFileStore = async (): Promise<void> => {
  await fs.mkdir(path.dirname(FILE_STORE_PATH), { recursive: true });
  try {
    await fs.access(FILE_STORE_PATH);
  } catch {
    await fs.writeFile(FILE_STORE_PATH, "[]", "utf8");
  }
};

const readFileProfiles = async (): Promise<IProfile[]> => {
  await ensureFileStore();
  const raw = await fs.readFile(FILE_STORE_PATH, "utf8");
  if (!raw.trim()) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as IProfile[]) : [];
};

const writeFileProfiles = async (profiles: IProfile[]): Promise<void> => {
  await ensureFileStore();
  await fs.writeFile(FILE_STORE_PATH, JSON.stringify(profiles, null, 2), "utf8");
};

export const Profile = {
  async init(): Promise<void> {
    if (isPostgresStorage()) {
      const db = getPool();
      await db.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          headline VARCHAR(255) DEFAULT '',
          target_role VARCHAR(255) DEFAULT '',
          github_url VARCHAR(255) DEFAULT '',
          linkedin_url VARCHAR(255) DEFAULT '',
          resume_filename VARCHAR(255) DEFAULT '',
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      return;
    }
    await ensureFileStore();
  },

  async findByUserId(user_id: string): Promise<IProfile | null> {
    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query("SELECT * FROM profiles WHERE user_id = $1", [user_id]);
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        headline: row.headline,
        targetRole: row.target_role,
        githubUrl: row.github_url,
        linkedinUrl: row.linkedin_url,
        resumeFileName: row.resume_filename,
        updated_at: row.updated_at,
      };
    }

    const profiles = await readFileProfiles();
    return profiles.find((p) => p.user_id === user_id) || null;
  },

  async upsert(user_id: string, data: Omit<IProfile, "id" | "user_id" | "updated_at">): Promise<IProfile> {
    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query(
        `INSERT INTO profiles (user_id, headline, target_role, github_url, linkedin_url, resume_filename, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
         ON CONFLICT (user_id) 
         DO UPDATE SET 
           headline = EXCLUDED.headline,
           target_role = EXCLUDED.target_role,
           github_url = EXCLUDED.github_url,
           linkedin_url = EXCLUDED.linkedin_url,
           resume_filename = EXCLUDED.resume_filename,
           updated_at = NOW()
         RETURNING *`,
        [user_id, data.headline, data.targetRole, data.githubUrl, data.linkedinUrl, data.resumeFileName]
      );
      const row = rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        headline: row.headline,
        targetRole: row.target_role,
        githubUrl: row.github_url,
        linkedinUrl: row.linkedin_url,
        resumeFileName: row.resume_filename,
        updated_at: row.updated_at,
      };
    }

    const profiles = await readFileProfiles();
    const existingIndex = profiles.findIndex((p) => p.user_id === user_id);
    const updated_at = new Date().toISOString();

    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...data, updated_at };
      await writeFileProfiles(profiles);
      return profiles[existingIndex];
    }

    const newProfile: IProfile = {
      id: randomUUID(),
      user_id,
      ...data,
      updated_at,
    };
    profiles.push(newProfile);
    await writeFileProfiles(profiles);
    return newProfile;
  },
};
