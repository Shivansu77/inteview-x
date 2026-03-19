import bcrypt from "bcryptjs";
import { pool } from "../config/db";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  created_at: Date;
  updated_at: Date;
}

export const User = {
  /** Create the users table if it doesn't exist */
  async init(): Promise<void> {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";`);

    await pool.query(`
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
  },

  /** Find all users (excluding password) */
  async find(): Promise<Omit<IUser, "password">[]> {
    const { rows } = await pool.query(
      "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  },

  /** Find a single user by ID (excluding password) */
  async findById(id: string): Promise<Omit<IUser, "password"> | null> {
    const { rows } = await pool.query(
      "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  /** Find a single user by email (includes password for auth) */
  async findByEmail(email: string): Promise<IUser | null> {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0] || null;
  },

  /** Create a new user with hashed password */
  async create(data: { name: string; email: string; password: string }): Promise<IUser> {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at, updated_at`,
      [data.name, data.email, hashedPassword]
    );
    return rows[0];
  },

  /** Compare a candidate password with a hashed password */
  async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },
};
