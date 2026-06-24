import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getActiveStorageBackend, pool } from "../config/db";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  created_at: Date | string;
  updated_at: Date | string;
}

export type PublicUser = Omit<IUser, "password">;

const FILE_STORE_PATH = path.resolve(process.cwd(), ".data", "users.json");

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const isPostgresStorage = (): boolean => getActiveStorageBackend() === "postgres";

const getPool = () => {
  if (!pool) {
    throw new Error("PostgreSQL pool is not configured.");
  }

  return pool;
};

const toPublicUser = (user: IUser): PublicUser => {
  const { password: _password, ...publicUser } = user;
  return publicUser;
};

const ensureFileStore = async (): Promise<void> => {
  await fs.mkdir(path.dirname(FILE_STORE_PATH), { recursive: true });

  try {
    await fs.access(FILE_STORE_PATH);
  } catch {
    await fs.writeFile(FILE_STORE_PATH, "[]", "utf8");
  }
};

const readFileUsers = async (): Promise<IUser[]> => {
  await ensureFileStore();
  const raw = await fs.readFile(FILE_STORE_PATH, "utf8");

  if (!raw.trim()) {
    return [];
  }

  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as IUser[]) : [];
};

const writeFileUsers = async (users: IUser[]): Promise<void> => {
  await ensureFileStore();
  await fs.writeFile(FILE_STORE_PATH, JSON.stringify(users, null, 2), "utf8");
};

export const User = {
  /** Create the users table if it doesn't exist */
  async init(): Promise<void> {
    if (isPostgresStorage()) {
      const db = getPool();
      await db.query(`CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";`);

      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await db.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);`);
      return;
    }

    await ensureFileStore();
  },

  /** Find all users (excluding password) */
  async find(): Promise<PublicUser[]> {
    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC"
      );
      return rows;
    }

    const users = await readFileUsers();
    return users
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(toPublicUser);
  },

  /** Find a single user by ID (excluding password) */
  async findById(id: string): Promise<PublicUser | null> {
    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1",
        [id]
      );
      return rows[0] || null;
    }

    const users = await readFileUsers();
    const user = users.find((entry) => entry.id === id);
    return user ? toPublicUser(user) : null;
  },

  /** Find a single user by email (includes password for auth) */
  async findByEmail(email: string): Promise<IUser | null> {
    const normalizedEmail = normalizeEmail(email);

    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [normalizedEmail]);
      return rows[0] || null;
    }

    const users = await readFileUsers();
    return users.find((entry) => normalizeEmail(entry.email) === normalizedEmail) || null;
  },

  /** Create a new user with hashed password */
  async create(data: { name: string; email: string; password: string }): Promise<PublicUser> {
    const normalizedEmail = normalizeEmail(data.email);
    const normalizedName = data.name.trim();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    if (isPostgresStorage()) {
      const db = getPool();
      const { rows } = await db.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
         RETURNING id, name, email, role, created_at, updated_at`,
        [normalizedName, normalizedEmail, hashedPassword]
      );
      return rows[0];
    }

    const users = await readFileUsers();
    const now = new Date().toISOString();
    const user: IUser = {
      id: randomUUID(),
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      created_at: now,
      updated_at: now,
    };

    users.push(user);
    await writeFileUsers(users);

    return toPublicUser(user);
  },

  /** Compare a candidate password with a hashed password */
  async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },
};
