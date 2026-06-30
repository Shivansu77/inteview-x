import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getActiveStorageBackend, pool } from "../config/db";

export interface IInterview {
  id: string;
  user_id: string;
  role: string;
  experience: string;
  topic: string;
  review: any;
  questionHistory: any[];
  created_at: Date | string;
}

const FILE_STORE_PATH = path.resolve(process.cwd(), ".data", "interviews.json");

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

const readFileInterviews = async (): Promise<IInterview[]> => {
  await ensureFileStore();
  const raw = await fs.readFile(FILE_STORE_PATH, "utf8");
  if (!raw.trim()) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as IInterview[]) : [];
};

const writeFileInterviews = async (interviews: IInterview[]): Promise<void> => {
  await ensureFileStore();
  await fs.writeFile(FILE_STORE_PATH, JSON.stringify(interviews, null, 2), "utf8");
};

export const Interview = {
  async init(): Promise<void> {
    if (isPostgresStorage()) {
      const db = getPool();
      await db.query(`
        CREATE TABLE IF NOT EXISTS interviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(255) NOT NULL,
          experience VARCHAR(255) NOT NULL,
          topic VARCHAR(255) NOT NULL,
          review JSONB NOT NULL,
          question_history JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      await db.query(`CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews (user_id);`);
      return;
    }
    await ensureFileStore();
  },

  async findByUserId(user_id: string): Promise<IInterview[]> {
    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query(
        "SELECT * FROM interviews WHERE user_id = $1 ORDER BY created_at DESC",
        [user_id]
      );
      return rows.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        role: row.role,
        experience: row.experience,
        topic: row.topic,
        review: row.review,
        questionHistory: row.question_history,
        created_at: row.created_at,
      }));
    }

    const interviews = await readFileInterviews();
    return interviews
      .filter((i) => i.user_id === user_id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async create(data: Omit<IInterview, "id" | "created_at">): Promise<IInterview> {
    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query(
        `INSERT INTO interviews (user_id, role, experience, topic, review, question_history) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [data.user_id, data.role, data.experience, data.topic, data.review, JSON.stringify(data.questionHistory)]
      );
      const row = rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        role: row.role,
        experience: row.experience,
        topic: row.topic,
        review: row.review,
        questionHistory: row.question_history,
        created_at: row.created_at,
      };
    }

    const interviews = await readFileInterviews();
    const newInterview: IInterview = {
      id: randomUUID(),
      ...data,
      created_at: new Date().toISOString(),
    };
    interviews.push(newInterview);
    await writeFileInterviews(interviews);
    return newInterview;
  },

  async deleteById(id: string, user_id: string): Promise<boolean> {
    if (isPostgresStorage()) {
      const db = getPool();
      const { rowCount } = await db.query("DELETE FROM interviews WHERE id = $1 AND user_id = $2", [id, user_id]);
      return (rowCount ?? 0) > 0;
    }

    const interviews = await readFileInterviews();
    const initialLength = interviews.length;
    const filtered = interviews.filter((i) => !(i.id === id && i.user_id === user_id));
    if (filtered.length < initialLength) {
      await writeFileInterviews(filtered);
      return true;
    }
    return false;
  },

  async deleteByUserId(user_id: string): Promise<boolean> {
    if (isPostgresStorage()) {
      const db = getPool();
      await db.query("DELETE FROM interviews WHERE user_id = $1", [user_id]);
      return true;
    }

    const interviews = await readFileInterviews();
    const filtered = interviews.filter((i) => i.user_id !== user_id);
    await writeFileInterviews(filtered);
    return true;
  },
};
